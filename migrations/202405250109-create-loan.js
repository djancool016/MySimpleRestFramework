module.exports = {
    tableName: "loan",
    timestamp: true,
    columns: [
        {
            columnName: "id",
            dataType: "INT",
            nullable: false,
            autoIncrement: true,
        },
        {
            columnName: "userId",
            dataType: "INT",
            nullable: false
        },
        {
            columnName: "loanAmount",
            dataType: "INT",
            nullable: false
        },
        {
            columnName: "interestRate",
            dataType: "DECIMAL(5, 2)",
            nullable: false
        },
        {
            columnName: "startDate",
            dataType: "DATE",
            nullable: false
        },
        {
            columnName: "endDate",
            dataType: "DATE",
            nullable: false
        },
        {
            columnName: "status",
            dataType: "INT",
            nullable: false,
            references: {table:'status', key:'id'},
            default: 1
        }
    ]
}