import type IEvent from "../interfaces/IEvent";

const messageEvent: IEvent = {
  name: "connected",
  execute: (address, port) => {
    console.log(`Connected to ${address}:${port}`);
  }
};

export default messageEvent;