import { Request, Response } from 'express';
import { RickAndMortyService, RickAndMortyCharacter } from '../services/RickAndMortyService';

const rickAndMortyService = new RickAndMortyService();

export class CharacterController {
  /**
   * Get characters from Rick and Morty API
   */
  async getCharacters(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, name, status, species, gender } = req.query;
      
      const filters = {
        page: page ? Number(page) : undefined,
        name: name as string,
        status: status as string,
        species: species as string,
        gender: gender as string
      };

      const response = await rickAndMortyService.getCharacters(filters);
      
      // Return the complete character data for frontend flexibility
      res.json({
        characters: response.results,
        info: response.info
      });
    } catch (error: any) {
      console.error('Error fetching characters:', error);
      
      if (error.message?.includes('HTTP 404')) {
        res.status(404).json({ 
          error: 'No characters found with the specified criteria' 
        });
      } else {
        res.status(500).json({ 
          error: 'Failed to fetch characters from Rick and Morty API' 
        });
      }
    }
  }

  /**
   * Get a single character by ID
   */
  async getCharacterById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const response = await rickAndMortyService.getCharacterById(Number(id));
      
      // Return the complete character data
      res.json(response);
    } catch (error: any) {
      console.error('Error fetching character:', error);
      
      if (error.message?.includes('HTTP 404')) {
        res.status(404).json({ 
          error: 'Character not found' 
        });
      } else {
        res.status(500).json({ 
          error: 'Failed to fetch character from Rick and Morty API' 
        });
      }
    }
  }
}
