import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { User } from './src/models/user.model';
import * as bcrypt from 'bcrypt';

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection and creating test data...');
  
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    
    // Test basic connection
    const userModel = app.get<typeof User>('UserRepository');
    console.log('✅ Database connection established');
    
    // Try to sync only the User table
    await User.sync({ force: false });
    console.log('✅ User table synced');
    
    // Check if any users exist
    const userCount = await User.count();
    console.log(`📊 Current user count: ${userCount}`);
    
    if (userCount === 0) {
      console.log('🔧 Creating test user...');
      
      // Create a test user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const testUser = await User.create({
        first_name: 'Admin',
        last_name: 'User',
        name: 'Admin User',
        email: 'admin@example.com',
        password_hash: hashedPassword,
        role: 'Admin',
        organization_id: null,
        status: 'Active'
      });
      
      console.log('✅ Test user created:', testUser.email);
    } else {
      console.log('✅ Users already exist in database');
    }
    
    await app.close();
    console.log('🎉 Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
}

testDatabaseConnection();