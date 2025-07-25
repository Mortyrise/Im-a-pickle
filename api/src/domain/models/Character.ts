export interface CharacterOrigin {
  name: string;
  url: string;
}

export interface CharacterLocation {
  name: string;
  url: string;
}

export interface CharacterProps {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: CharacterOrigin;
  location: CharacterLocation;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export class Character {
  private readonly props: CharacterProps;

  constructor(props: CharacterProps) {
    this.props = { ...props };
  }

  
  get id(): number { 
    return this.props.id; 
  }
  
  get name(): string { 
    return this.props.name; 
  }
  
  get status(): string { 
    return this.props.status; 
  }
  
  get species(): string { 
    return this.props.species; 
  }
  
  get type(): string { 
    return this.props.type; 
  }
  
  get gender(): string { 
    return this.props.gender; 
  }
  
  get origin(): CharacterOrigin { 
    return this.props.origin; 
  }
  
  get location(): CharacterLocation { 
    return this.props.location; 
  }
  
  get image(): string { 
    return this.props.image; 
  }
  
  get episode(): string[] { 
    return this.props.episode; 
  }
  
  get url(): string { 
    return this.props.url; 
  }
  
  get created(): string { 
    return this.props.created; 
  }

  static fromApiResponse(apiData: any): Character {
    return new Character({
      id: apiData.id,
      name: apiData.name,
      status: apiData.status,
      species: apiData.species,
      type: apiData.type || '',
      gender: apiData.gender,
      origin: apiData.origin,
      location: apiData.location,
      image: apiData.image,
      episode: apiData.episode,
      url: apiData.url,
      created: apiData.created
    });
  }
}
