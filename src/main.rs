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

use std::io::prelude::*;
use std::net::{TcpListener, TcpStream};
use std::str;

const JS_IMPORT_URL: &str = "https://relacibo.github.io/chess-manage/public/js/index.min.js";
const HOST: &str = "127.0.0.1";
const PORT: &str = "11492";
const BUFFER_SIZE: usize = 150;

struct Arguments {
    username: String,
    rated: bool,
    clock_limit: Option<i32>,
    clock_increment: Option<i32>,
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
    let mut buffer = [0; BUFFER_SIZE];
    stream.read(&mut buffer).unwrap();
    stream.flush().unwrap();
    let args: Arguments = match parse_arguments(&mut buffer) {
        Ok(args) => args,
        Err(e) => {
            println!("{}", e);
            stream.write("HTTP/1.1 404 NOT FOUND\r\n\r\n".as_bytes()).unwrap();
            stream.flush().unwrap();
            return;
        }
    };
    let response = create_content(&args);
    println!("{}", response);
    stream.write(response.as_bytes()).unwrap();
    stream.flush().unwrap();
}

fn parse_arguments(buffer: &[u8]) -> Result<Arguments, String> {
    let len = buffer.len();
    println!("{}", str::from_utf8(buffer).unwrap());
    if len < 3 || buffer[0] as char != 'G' || buffer[1] as char != 'E' || buffer[2] as char != 'T' {
        return Err("No GET request!".to_owned());
    }

    let mut index: usize = 4;
    let mut c: char;
    let mut username: Option<String> = None;
    let mut rated: Option<bool> = None;
    let mut clock_limit: Option<i32> = None;
    let mut clock_increment: Option<i32> = None;
    let mut parse_state: i8 = 0;
    let mut key: String = String::default();
    let mut val: String = String::default();
    while index < len {
        c = buffer[index] as char;

        if c == '\n' {
            return Err("No space after get params!".to_owned());
        }
        match parse_state {
            0 if c == '?' => parse_state = 1,
            1 if c == '=' => parse_state = 2,
            1 if c == '+' || c == ' ' => {
                if key == "rated" {
                    rated = Some(true)
                }
                if c == ' ' {
                    break;
                }
                key = String::default();
            }
            1 => key.push(c),
            2 if c == '+' || c == ' ' => {
                match key.as_str() {
                    "username" => username = Some(val),
                    "clock-limit" => {
                        clock_limit = Some(val.parse::<i32>().map_err(|err| err.to_string())?)
                    }
                    "clock-increment" => {
                        clock_increment = Some(val.parse::<i32>().map_err(|err| err.to_string())?)
                    }
                    _ => (),
                }
                if c == ' ' {
                    break;
                }
                key = String::default();
                val = String::default();
                parse_state = 1;
            }
            2 => val.push(c),
            _ => (),
        }
        index += 1;
    }
    if username.is_none() {
        return Err("required get param not set".to_owned());
    }
    let args = Arguments {
        username: username.unwrap(),
        rated: rated.unwrap_or(false),
        clock_limit: clock_limit,
        clock_increment: clock_increment,
    };
    return Ok(args);
}

fn create_content(args: &Arguments) -> String {
    let options_list = [
        Some(format!("username = {}", args.username)),
        Some(format!("rated = {}", args.rated.to_string())),
        args.clock_limit
            .map(|x| format!("clockLimit = {}", x.to_string())),
        args.clock_increment
            .map(|x| format!("clockIncrement = {}", x.to_string())),
    ]
    .iter()
    .flatten()
    .fold(String::default(), |x, y| format!("{}{},", x, y));
    let content = format!("<!DOCTYPE html><html><script src=\"{}\"></script><script>chessManage.init({{{}}});</script><body>Hallo Welt</body></html>", JS_IMPORT_URL, options_list);
    return format!(
        "HTTP/1.1 200 OK\r\n\r\n{}\r\n", content);
}
