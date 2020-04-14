/*
 *  chess_manage_templating
 *  Copyright (C) 2020  Reinhard Bronner
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

extern crate base64;

use std::io::prelude::*;
use std::net::{TcpListener, TcpStream};
use std::str;

const HOST: &'static str = "127.0.0.1";
const PORT: &'static str = "11492";
const BUFFER_SIZE: usize = 150;

struct Request {
    get_params: Vec<(String, Option<Vec<u8>>)>,
    header_pairs: Vec<(String, Vec<u8>)>,
}

#[derive(Debug, PartialEq, Eq)]
enum ParseState {
    SkipAfterQMark,
    ReadGetKey,
    ReadGetValue,
    SkipRestFirstLine,
    ReadHeaderKey,
    ReadHeaderValue,
    Finished,
}

fn main() {
    println!("Started listening on port {}", PORT);
    let listener = TcpListener::bind(format!("{}:{}", HOST, PORT)).unwrap();
    for stream in listener.incoming() {
        let stream = stream.unwrap();
        handle_connection(stream);
    }
}

fn handle_connection(mut stream: TcpStream) {
    let req: Request = match parse_request(&stream) {
        Ok(req) => req,
        Err(e) => {
            println!("{}", e);
            stream.write("HTTP/1.1 404 NOT FOUND\r\n\r\n".as_bytes()).unwrap();
            stream.flush().unwrap();
            return;
        }
    };
    let response = create_content(req);
    // Debug
    println!("Respond: {}", response);
    stream.write(response.as_bytes()).unwrap();
    stream.flush().unwrap();
}

fn parse_request(mut stream: &TcpStream) -> Result<Request, String> {
    let mut buffer = [0; BUFFER_SIZE];
    let mut size = stream.read(&mut buffer).map_err(|err| err.to_string())?;
    if size < 5
        || buffer[0] as char != 'G'
        || buffer[1] as char != 'E'
        || buffer[2] as char != 'T'
        || buffer[3] as char != ' '
        || buffer[4] as char != '/'
    {
        return Err("No GET request!".to_owned());
    }

    let mut index: usize = 5;
    let mut c: char;
    let mut u: u8;
    let mut parse_state: ParseState = ParseState::SkipAfterQMark;
    let mut get_params: Vec<(String, Option<Vec<u8>>)> = vec![];
    let mut header_pairs: Vec<(String, Vec<u8>)> = vec![];
    let mut key: String = String::new();
    let mut val: Vec<u8> = vec![];
    loop {
        while index < size {
            u = buffer[index];
            c = u as char;
            match parse_state {
                ParseState::SkipAfterQMark if c == '?' => parse_state = ParseState::ReadGetKey,
                ParseState::SkipAfterQMark if c == ' ' => {
                    parse_state = ParseState::SkipRestFirstLine
                }
                ParseState::ReadGetKey if c == '=' => parse_state = ParseState::ReadGetValue,
                ParseState::ReadGetKey if c == '+' || c == ' ' => {
                    get_params.push((key, None));
                    key = String::new();
                    parse_state = if c == ' ' {
                        val = vec![];
                        ParseState::SkipRestFirstLine
                    } else {
                        ParseState::ReadGetKey
                    }
                }
                ParseState::ReadGetKey => key.push(c),
                ParseState::ReadGetValue if c == '+' || c == ' ' => {
                    get_params.push((key, Some(val)));
                    key = String::new();
                    val = vec![];
                    parse_state = if c == '+' {
                        ParseState::ReadGetKey
                    } else {
                        ParseState::SkipRestFirstLine
                    };
                }
                ParseState::ReadGetValue => val.push(u),
                ParseState::SkipRestFirstLine if c == '\n' => {
                    parse_state = ParseState::ReadHeaderKey
                }
                ParseState::ReadHeaderKey if c == ':' => parse_state = ParseState::ReadHeaderValue,
                ParseState::ReadHeaderKey if c == ' ' || c == '\n' => {
                    parse_state = ParseState::Finished;
                    break;
                }
                ParseState::ReadHeaderKey => key.push(c),
                ParseState::ReadHeaderValue if c == '\n' => {
                    if key == "Cookie" {
                        header_pairs.push((key, val));
                    }
                    key = String::new();
                    val = vec![];
                    parse_state = ParseState::ReadHeaderKey;
                }
                ParseState::ReadHeaderValue if c == ' ' => (),
                ParseState::ReadHeaderValue => val.push(u),
                _ => (),
            }
            index += 1;
        }
        if parse_state == ParseState::Finished {
            stream.flush().unwrap();
            break;
        }
        size = stream.read(&mut buffer).map_err(|err| err.to_string())?;
        if size == 0 {
            break;
        }
        index = 0;
    }
    println!();
    // debug
    println!("GET-Params: ");

    let prinable_params = get_params.clone().into_iter().map(
        |(k, v)|(k.clone(), 
            v.map(|x|String::from_utf8(x).unwrap_or("ERROR".to_string())).unwrap_or("<NICHTS>".to_string())
        )
    ).collect::<Vec<(String, String)>>();

    let printable_header = header_pairs.clone().into_iter().map(
        |(k, v)|(k.clone(), 
            String::from_utf8(v).unwrap_or("<ERROR>".to_string())
        )
    ).collect::<Vec<(String, String)>>();
    for (ref k, ref v) in &prinable_params {
        println!("{} -> {}", k, v);
    }
    println!("Header: ");
    for (ref k, ref v) in &printable_header {
        println!("{} -> {}", k, v);
    }

    // debug end

    println!();
    return Ok(Request {
        get_params,
        header_pairs,
    });
}

fn create_content(req: Request) -> String {
    let iter0 = req
        .get_params
        .into_iter()
        .map(|(key, o_val)| (key, o_val.unwrap_or(vec![116, 114, 117, 101])));
    let iter1 = req
            .header_pairs
                .into_iter();

    let options = iter0.chain(iter1)
        .map(|(key, val)| format!("\"{}\":\"{}\"", key, base64::encode(val)))
        .collect::<Vec<String>>()
        .join(",");

    let content = format!(
        "HTTP/1.1 200 OK\r\n\r\n<!DOCTYPE html><html><link rel=\"icon\" href=\"data:;base64,=\"><script src=\"https://relacibo.github.io/chess-manage/public/js/index.min.js\"></script><script>chessManage.init({{{}}});</script><body></body></html>\r\n", 
        options
    );
    return content;
}
