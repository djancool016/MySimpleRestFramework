module.exports = {
    table: 'loanPayment',
    seed: [
        {
            id: 1,
            loanId: 1,
            paymentAmount: 100000,
            paymentDate: '2024-06-21',
        },{
            id: 2,
            loanId: 1,
            paymentAmount: 200000,
            paymentDate: '2024-07-21',
        },{
            id: 3,
            loanId: 1,
            paymentAmount: 300000,
            paymentDate: '2024-08-21',
        }
    ]
}