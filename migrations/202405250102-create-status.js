module.exports = {
    tableName: "status",
    timestamp: false,
    columns: [
        {
            columnName: "id",
            dataType: "INT",
            nullable: false,
            autoIncrement: true,
        },
        {
            columnName: "name",
            dataType: "VARCHAR(50)",
            nullable: false
        }
    ]
}