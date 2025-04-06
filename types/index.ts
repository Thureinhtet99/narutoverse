export type CharacterPersonalType = {
  birthdate?: string;
  sex?: string;
  age?:
    | string
    | {
        "Part I"?: string;
        "Part II"?: string;
        "Academy Graduate"?: string;
        [key: string]: string | undefined;
      };
  status?: string;
  height?:
    | string
    | {
        "Part I"?: string;
        "Part II"?: string;
        "Blank Period"?: string;
        [key: string]: string | undefined;
      };
  weight?:
    | string
    | {
        "Part I"?: string;
        "Part II"?: string;
        [key: string]: string | undefined;
      };
  bloodType?: string;
  kekkeiGenkai?: string | string[];
  classification?: string | string[];
  occupation?: string | string[];
  affiliation?: string | string[];
  team?: string | string[];
  partner?: string | string[];
  species?: string;
  jinchūriki?: string[];
  titles?: string[];
  tailedBeast?: string;
  clan?: string;
};

export type CharacterFamilyType = {
  [key: string]: string;
};

export type CharacterDebutType = {
  manga?: string;
  anime?: string;
  novel?: string;
  movie?: string;
  game?: string;
  ova?: string;
  appearsIn?: string;
  [key: string]: string | undefined;
};

export type CharacterRankType = {
  ninjaRank?:
    | string
    | {
        "Part I"?: string;
        Gaiden?: string;
        [key: string]: string | undefined;
      };
  ninjaRegistration?: string;
};

export type CharacterVoiceActorsType = {
  japanese?: string | string[];
  english?: string | string[];
};

export type CharacterType = {
  id: number;
  name: string;
  images?: string[];
  debut?: CharacterDebutType;
  jutsu?: string[];
  natureType?: string[];
  personal?: CharacterPersonalType;
  rank?: string | CharacterRankType;
  tools?: string[];
  family?: CharacterFamilyType;
  village?: string;
  uniqueTraits?: string[];
  voiceActors?: CharacterVoiceActorsType;
};

export type ClanType = {
  id: number;
  name: string;
  characters?: CharacterType[];
};
