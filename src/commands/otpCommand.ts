import { sleep } from "bun";
import type IEvent from "../interfaces/IEvent";
import { time } from "node:console";

class Account {
  gameName: string;
  tagLine: string;
  champion: string;

  constructor(gameName: string, tagLine: string, champion: string) {
    this.gameName = gameName;
    this.tagLine = tagLine;
    this.champion = champion;
  }
}

class MatchInfo {
  endOfGameResult: string;
  gameCreation: number;
  gameDuration: number;
  gameEndTimestamp: number;

  constructor(
    endOfGameResult: string,
    gameCreation: number,
    gameDuration: number,
    gameEndTimestamp: number
  ) {
    this.endOfGameResult = endOfGameResult;
    this.gameCreation = gameCreation;
    this.gameDuration = gameDuration;
    this.gameEndTimestamp = gameEndTimestamp;
  }
}

class RiotAccount {
  puuid: string;
  gameName: string;
  tagLine: string;

  constructor(puuid: string, gameName: string, tagLine: string) {
    this.puuid = puuid;
    this.gameName = gameName;
    this.tagLine = tagLine;
  }
}

const RIOT_ACCOUNT_BY_NAME_AND_TAG_API_URL =
  "https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/%s/%s?api_key=a";
const MATCH_HISTORY_IDS_BY_PUUID =
  "https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/%s/ids?start=0&count=20&api_key=a";
const MATCH_INFO_API_URL =
  "https://europe.api.riotgames.com/lol/match/v5/matches/%s?api_key=a";

const loadAccountMappings = async (channel: string): Promise<Account[]> => {
  return [
    //new Account("Agurin", "EUW"),
    //new Account("Bgurin", "4000", "AGURIN"),
    new Account("NattyNatt", "2005", "Rengar"),
    new Account("Engage", "EUW", "Zac"),
    new Account("Raydioactiveman", "5002", "Zac"),
    new Account("Boat Crew 2", "David", "Zac"),
    new Account("Zac Nani", "PELO", "Zac"),
    new Account("Roulette", "EUW", "Ivern"),
    new Account("DenSygeKamel69", "EUW", "Udyr"),
    new Account("star zall", "twtv", "Veigar"),
    new Account("Lathyrus", "EUW", "Bard"),
    new Account("Sinerias", "EUW", "MasterYi"),
    new Account("Kittxnly alt", "Luna", "Lulu"),
    new Account("twojstary2komary", "win", "Lulu"),
    new Account("Molnigt", "EUW", "Yasuo"),
    new Account("Odysseus", "131", "Taliyah"),
    new Account("twtv exofeng", "IWNL", "Draven"),
    new Account("Duras Diurpaneus", "rnk1", "Draven"),
    new Account("KDF DuDu", "KING1", "Ksante"),
    new Account("João", "EUW", "Garen"),
    new Account("Goofy19", "024", "Ezreal"),
    new Account("gothic 3 enjoyer", "EUW", "Poppy"),
  ];
};

class RateLimiter {
  private requestsPerSecondLimit: number;
  private requestsPerMinuteLimit: number;
  private requestsPerSecond: number[] = [];
  private requestsPerMinute: number[] = [];

  constructor(
    requestsPerSecondLimit: number = 20,
    requestsPerMinuteLimit: number = 100
  ) {
    this.requestsPerSecondLimit = requestsPerSecondLimit;
    this.requestsPerMinuteLimit = requestsPerMinuteLimit;
  }

  private cleanupOldRequests() {
    const now = Date.now();

    this.requestsPerSecond = this.requestsPerSecond.filter(
      (timestamp) => now - timestamp < 1000
    );

    this.requestsPerMinute = this.requestsPerMinute.filter(
      (timestamp) => now - timestamp < 60 * 1000
    );
  }

  public async requestAllowed(): Promise<void> {
    this.cleanupOldRequests();

    if (
      this.requestsPerSecond.length >= this.requestsPerSecondLimit ||
      this.requestsPerMinute.length >= this.requestsPerMinuteLimit
    ) {
      const nextAvailableTime = Math.min(
        this.requestsPerSecond[0] + 1000 - Date.now(),
        this.requestsPerMinute[0] + 60 * 1000 - Date.now()
      );

      if (nextAvailableTime > 0) {
        console.log(`Rate limit exceeded, waiting for ${nextAvailableTime}ms`);
        await sleep(nextAvailableTime);
      }
    }
  }

  public recordRequest() {
    const now = Date.now();
    this.requestsPerSecond.push(now);
    this.requestsPerMinute.push(now);
  }
}

const rateLimiter = new RateLimiter();

const getRiotAccountByNameAndTag = async (
  name: string,
  tag: string
): Promise<RiotAccount | null> => {
  try {
    await rateLimiter.requestAllowed();
    const url = RIOT_ACCOUNT_BY_NAME_AND_TAG_API_URL.replace(
      "%s",
      encodeURIComponent(name)
    ).replace("%s", encodeURIComponent(tag));
    console.log("url: " + url);
    const response = await fetch(url);
    if (response.ok) {
      rateLimiter.recordRequest();
      const data = await response.json();
      return new RiotAccount(data.puuid, data.gameName, data.tagLine);
    }
    console.error("Failed to fetch Riot account");
  } catch (error) {
    console.error(error);
  }
  return null;
};

const getMatchHistoryIdsByPuuid = async (
  puuid: string
): Promise<string[] | null> => {
  try {
    await rateLimiter.requestAllowed();
    const url = MATCH_HISTORY_IDS_BY_PUUID.replace("%s", puuid);
    console.log("url: " + url);
    const response = await fetch(url);
    if (response.ok) {
      rateLimiter.recordRequest();
      return (await response.json()) as string[];
    }
    console.error("Failed to fetch match history for");
  } catch (error) {
    console.error(error);
  }
  return null;
};

const getMatchInfo = async (matchId: string): Promise<MatchInfo | null> => {
  try {
    await rateLimiter.requestAllowed();
    const url = MATCH_INFO_API_URL.replace("%s", matchId);
    console.log("url: " + url);
    const response = await fetch(url);
    if (response.ok) {
      rateLimiter.recordRequest();
      const data = await response.json();
      return new MatchInfo(
        data.info.endOfGameResult,
        data.info.gameCreation,
        data.info.gameDuration,
        data.info.gameEndTimestamp
      );
    }
    console.error("Failed to fetch match info");
  } catch (error) {
    console.error(error);
  }
  return null;
};
const isTimestampWithinLast20Minutes = (timestamp: number): boolean => {
  const currentTimeMillis = Date.now();
  const twentyMinutesInMillis = 20 * 60 * 1000;
  return currentTimeMillis - timestamp <= twentyMinutesInMillis;
};

const cooldowns: Map<string, number> = new Map();

const otpCommand: IEvent = {
  name: "otp",
  execute: async (client, commands, channel, userstate, message, self) => {
    if (self) return;

    if (userstate.username !== "plasma_____") {
      return;
    }

    const now = Date.now();
    const cooldownKey = `${channel}:${userstate.username}`;
    const lastUsed = cooldowns.get(cooldownKey) || 0;

    if (now - lastUsed < 120 * 1000) {
      const timeLeft = Math.ceil((120 * 1000 - (now - lastUsed)) / 1000);
      console.log(timeLeft);
      console.log("cd sry");
      //client.say(
      //  channel,
      //  `Please wait ${timeLeft} more seconds before using this command again.`
      //);
      return;
    }

    cooldowns.set(cooldownKey, now);

    const accounts = await loadAccountMappings(channel);
    let result = "";
    for (const account of accounts) {
      const { gameName, tagLine, champion } = account;
      console.log("Doing: " + gameName);

      const riotAccount = await getRiotAccountByNameAndTag(gameName, tagLine);
      if (!riotAccount) continue;

      const matchIds = await getMatchHistoryIdsByPuuid(riotAccount.puuid);
      if (!matchIds || matchIds.length === 0) continue;

      const matchInfo = await getMatchInfo(matchIds[0]);
      if (!matchInfo) continue;

      if (isTimestampWithinLast20Minutes(matchInfo.gameEndTimestamp)) {
        result += champion + ", ";
      }
    }

    if (result.length < 3) {
      result += "none";
    }

    client.say(channel, result);
  },
};

export default otpCommand;
