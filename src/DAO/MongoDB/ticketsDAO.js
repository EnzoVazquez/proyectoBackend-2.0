import ticketModel from "./models/ticketModel.js";

export default class ticketDao {
  getTickets = () => {
    return ticketModel.find().lean();
  };

  getTicketsBy = (params) => {
    return ticketModel.findOne(params).lean();
  };

  createTicket = (ticket) => {
    return ticketModel.create(ticket);
  };
}
