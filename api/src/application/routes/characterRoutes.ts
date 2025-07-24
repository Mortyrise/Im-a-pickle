import { Router } from 'express';
import { CharacterController } from '../controllers/CharacterController';

const router = Router();
const characterController = new CharacterController();

/**
 * @swagger
 * /api/characters:
 *   get:
 *     summary: Get characters from Rick and Morty API
 *     tags: [Characters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by character name
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [alive, dead, unknown]
 *         description: Filter by character status
 *       - in: query
 *         name: species
 *         schema:
 *           type: string
 *         description: Filter by character species
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [female, male, genderless, unknown]
 *         description: Filter by character gender
 *     responses:
 *       200:
 *         description: Characters retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 characters:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       name:
 *                         type: string
 *                       image:
 *                         type: string
 *                 info:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: number
 *                     pages:
 *                       type: number
 *                     next:
 *                       type: string
 *                       nullable: true
 *                     prev:
 *                       type: string
 *                       nullable: true
 *       404:
 *         description: No characters found with the specified criteria
 *       500:
 *         description: Server error
 */
router.get('/', characterController.getCharacters.bind(characterController));

/**
 * @swagger
 * /api/characters/{id}:
 *   get:
 *     summary: Get a single character by ID
 *     tags: [Characters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Character ID
 *     responses:
 *       200:
 *         description: Character retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 name:
 *                   type: string
 *                 image:
 *                   type: string
 *       404:
 *         description: Character not found
 *       500:
 *         description: Server error
 */
router.get('/:id', characterController.getCharacterById.bind(characterController));

export default router;
