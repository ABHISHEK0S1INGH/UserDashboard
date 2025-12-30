#!/usr/bin/env python3
"""Seed database with admin and test users"""
from dotenv import load_dotenv
load_dotenv()

import sys
sys.path.insert(0, '.')

from app import create_app, db
from app.models.user import User
from app.core.security import hash_password

app = create_app()

with app.app_context():
    print("="*60)
    print("SEEDING DATABASE WITH USERS")
    print("="*60)
    
    # Check if admin already exists
    existing_admin = User.query.filter_by(email='admin@example.com').first()
    if existing_admin:
        print("⚠️  Admin user already exists: admin@example.com")
    else:
        # Create admin user
        admin = User(
            email='admin@example.com',
            password_hash=hash_password('Admin123'),
            full_name='Admin User',
            role='admin',
            status='active'
        )
        db.session.add(admin)
        print("✅ Created admin user:")
        print("   Email: admin@example.com")
        print("   Password: Admin123")
        print("   Role: admin")
    
    # Check if regular user already exists
    existing_user = User.query.filter_by(email='user@example.com').first()
    if existing_user:
        print("⚠️  Regular user already exists: user@example.com")
    else:
        # Create regular user
        user = User(
            email='user@example.com',
            password_hash=hash_password('User123'),
            full_name='Regular User',
            role='user',
            status='active'
        )
        db.session.add(user)
        print("✅ Created regular user:")
        print("   Email: user@example.com")
        print("   Password: User123")
        print("   Role: user")
    
    try:
        db.session.commit()
        print()
        print("✅ Database seeding completed successfully!")
        
        # Show total users
        total = User.query.count()
        print(f"   Total users in database: {total}")
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error seeding database: {e}")
    
    print("="*60)
