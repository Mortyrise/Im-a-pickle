import { Character } from '../../domain/models/Character';
import { mockApiCharacterData, mockCharacterProps } from '../mocks/characterMocks';

describe('Character Domain Model', () => {
  describe('Constructor', () => {
    it('should create immutable character props', () => {
      const testProps = { ...mockCharacterProps };
      const character = new Character(testProps);
      const originalName = character.name;

      // Try to modify test props
      testProps.name = 'Modified Name';

      // Character should still have original values
      expect(character.name).toBe(originalName);
    });
  });

  describe('fromApiResponse', () => {
    it('should create Character from API response data', () => {
      const character = Character.fromApiResponse(mockApiCharacterData);

      expect(character.id).toBe(mockApiCharacterData.id);
      expect(character.name).toBe(mockApiCharacterData.name);
      expect(character.status).toBe(mockApiCharacterData.status);
      expect(character.species).toBe(mockApiCharacterData.species);
      expect(character.origin.name).toBe(mockApiCharacterData.origin.name);
      expect(character.location.name).toBe(mockApiCharacterData.location.name);
    });

    it('should handle missing type field', () => {
      const apiDataWithoutType: any = { ...mockApiCharacterData };
      delete apiDataWithoutType.type;

      const character = Character.fromApiResponse(apiDataWithoutType);

      expect(character.type).toBe('');
    });

    it('should handle null type field', () => {
      const apiDataWithNullType = { ...mockApiCharacterData, type: null };

      const character = Character.fromApiResponse(apiDataWithNullType);

      expect(character.type).toBe('');
    });
  });

  describe('toJSON', () => {
    it('should return plain object with all properties', () => {
      const character = new Character(mockCharacterProps);
      const json = character.toJSON();

      expect(json).toEqual(mockCharacterProps);
    });

    it('should be serializable to JSON string', () => {
      const character = new Character(mockCharacterProps);
      const json = character.toJSON();
      
      const jsonString = JSON.stringify(json);
      const parsed = JSON.parse(jsonString);

      expect(parsed.name).toBe(mockCharacterProps.name);
      expect(parsed.origin.name).toBe(mockCharacterProps.origin.name);
    });
  });
});
