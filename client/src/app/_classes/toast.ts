export class Toast {

    constructor(public message: string, public time = 5000) { }

    hidden = true;

    show() {
      this.hidden = false;
    }

    close() {
      this.hidden = true;
    }

    setMsg(message: string) {
      this.message = message;
    }

}
