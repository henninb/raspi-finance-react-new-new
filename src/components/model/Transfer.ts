export default interface Transfer {
  transferId: number;
  sourceAccount: string;
  destinationAccount: string;
  transactionDate: Date;
  amount: number;
  activeStatus: boolean;
  dateAdded?: Date;
  dateUpdated?: Date;
}
