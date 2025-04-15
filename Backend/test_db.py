import psycopg2
try:
    conn = psycopg2.connect(
        host='teamcollab-db.cpgy6yoaedvh.eu-north-1.rds.amazonaws.com',
        dbname='teamcollab_prod',
        user='postgres',
        password='postgres123',
        connect_timeout=3
    )
    print("✅ Successfully connected to database!")
    conn.close()
except Exception as e:
    print(f"❌ Connection failed: {e}")