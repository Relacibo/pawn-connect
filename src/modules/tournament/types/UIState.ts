import { SWITCH_VIEW } from "../enums/actions";

export class UIState {
  constructor(readonly viewId: string = SWITCH_VIEW) { }
}
