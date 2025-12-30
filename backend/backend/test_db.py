#!/usr/bin/env python3
"""Test database connection"""
from dotenv import load_dotenv
load_dotenv()

import sys
sys.path.insert(0, '.')

from app import create_app, db
from sqlalchemy import text

app = create_app()

with app.app_context():
    print("="*60)
    print("DATABASE CONNECTION TEST")
    print("="*60)
    print(f"Database URL: {app.config['SQLALCHEMY_DATABASE_URI']}")
    print(f"Database dialect: {db.engine.dialect.name}")
    print(f"Database driver: {db.engine.driver}")
    print()
    
    try:
        # Test connection
        result = db.session.execute(text('SELECT version()')).scalar()
        print("✅ PostgreSQL connection successful!")
        print(f"PostgreSQL version: {result.split(',')[0]}")
        print()
        
        # Check if users table exists
        table_check = db.session.execute(
            text("SELECT to_regclass('public.users')")
        ).scalar()
        
        if table_check:
            print("✅ 'users' table exists in database")
            
            # Count users
            user_count = db.session.execute(
                text('SELECT COUNT(*) FROM users')
            ).scalar()
            print(f"   Total users in database: {user_count}")
            
            # Show table columns
            columns = db.session.execute(text("""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'users' 
                ORDER BY ordinal_position
            """)).fetchall()
            print(f"   Table columns:")
            for col in columns:
                print(f"     - {col[0]} ({col[1]})")
        else:
            print("⚠️  'users' table does not exist")
            print("   Run migrations: flask db upgrade")
            
    except Exception as e:
        print("❌ Database connection failed!")
        print(f"   Error: {e}")
    
    print("="*60)
