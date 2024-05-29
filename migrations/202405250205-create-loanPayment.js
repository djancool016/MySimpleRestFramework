module.exports = {
    tableName: "loanPayment",
    timestamp: true,
    columns: [
        {
            columnName: "id",
            dataType: "INT",
            nullable: false,
            autoIncrement: true,
        },
        {
            columnName: "loanId",
            dataType: "INT",
            nullable: false
        },
        {
            columnName: "paymentAmount",
            dataType: "INT",
            nullable: false
        },
        {
            columnName: "paymentDate",
            dataType: "DATE",
            nullable: false
        }
    ]
}