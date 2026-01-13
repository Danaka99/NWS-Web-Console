# NuGenesis Web Services (NWS)

AWS-like management console for OpenStack infrastructure services.

## Features
- Identity Management (Keystone)
- Object Storage (Swift)
- Block Storage (Cinder)
- Compute (Nova)

## Prerequisites
- Node.js 16+ and npm
- OpenStack deployment with Keystone, Swift, Cinder, and Nova
- MongoDB (optional, for session management)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
   npm run install-all
```

3. Configure OpenStack endpoints:
```bash
   cd server
   cp .env.example .env
   # Edit .env with your OpenStack credentials
```

4. Start the application:
```bash
   # Development mode (both client and server)
   npm run dev

   # Or run separately:
   # Terminal 1
   npm run server
   
   # Terminal 2
   npm run client
```

5. Access the console at http://localhost:3000

## OpenStack Configuration

Update `server/.env` with your OpenStack details:

## API Endpoints

### Identity (Keystone)
- POST /api/identity/auth - Authenticate
- GET /api/identity/users - List users
- POST /api/identity/users - Create user
- DELETE /api/identity/users/:id - Delete user
- GET /api/identity/projects - List projects
- POST /api/identity/projects - Create project

### Object Storage (Swift)
- GET /api/storage/containers - List containers
- POST /api/storage/containers - Create container
- GET /api/storage/containers/:name/objects - List objects
- POST /api/storage/containers/:name/objects - Upload object

### Block Storage (Cinder)
- GET /api/block/volumes - List volumes
- POST /api/block/volumes - Create volume
- DELETE /api/block/volumes/:id - Delete volume

### Compute (Nova)
- GET /api/compute/instances - List instances
- POST /api/compute/instances - Create instance
- DELETE /api/compute/instances/:id - Delete instance

## License
MIT