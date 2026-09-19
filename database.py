import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="ammu@123*#",
        database="smartattend"
    )