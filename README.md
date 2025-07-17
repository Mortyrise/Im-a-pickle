# Rick and Morty Character Explorer

A web application to explore all the characters from the Rick and Morty series! Browse through the multiverse and discover your favorite characters with this easy-to-use interface.

## What This App Does

This is a Rick and Morty themed web application where you can:
- View all characters from the series
- Explore character details and information
- Browse through the vast Rick and Morty universe

The app is built with Node.js and uses Docker for easy setup, so you can get it running quickly without any complicated configuration.

## Architecture

This project consists of three main services:

- **Web App (Node.js)**: The main application running on port 3000
- **Database (PostgreSQL)**: Stores all the character data
- **Cache (Redis)**: Makes the app faster by caching frequently accessed data

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd RickAndMortyRepo
   ```

2. Start the application:
   ```bash
   docker-compose up -d
   ```

3. Open your browser and go to `http://localhost:3000`

That's it! Start exploring the Rick and Morty universe! 🛸

## Services

### API Server

- **Port**: 3000
- **Purpose**: Serves the Rick and Morty character data
- **Dependencies**: PostgreSQL, Redis

## Development

The API code should be placed in the `./api` directory. The container will automatically mount this directory and use the entrypoint script for initialization.

## File Structure

```
RickAndMortyRepo/
├── api/                 # Node.js application code
├── docker-compose.yml   # Docker services configuration
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Stopping the Application

```bash
docker-compose down
```

To completely reset and remove all data:

```bash
docker-compose down -v
```

## Notes

- All services are configured to restart automatically if they crash
- Character data is safely stored and persists between restarts
- The app is optimized with caching for better performance
