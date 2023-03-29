import { DISCOGS_KEY, DISCOGS_SECRET } from "@env";
import { Record } from "../types/Record";
import axios from "axios";
import { Alert } from "react-native";
import uuid from "react-native-uuid";

export async function searchDiscogsBarcode(barcode: string) {
  const records: Array<Record> = [];
  try {
    const response = await axios.get(
      "https://api.discogs.com/database/search?type=release&barcode=" + barcode,
      {
        headers: {
          Authorization: `Discogs key=${DISCOGS_KEY}, secret=${DISCOGS_SECRET}`,
        },
      }
    );

    response.data.results.forEach((item: any) => {
      records.push({
        id: item.id,
        album: item.title.split(" - ")[1],
        artist: item.title.split(" - ")[0],
        coverUrl: item.cover_image,
        date_published: item.year,
        country: item.country,
      });
    });

    return records;
  } catch (error) {
    console.error(error);
    return records;
  }
}

export async function fetchDiscogsRecord(recordId: string) {
  try {
    const response = await axios.get(
      "https://api.discogs.com/releases/" + recordId,
      {
        headers: {
          Authorization:
            "Discogs key=JuVXyKXnBbVqqyymMKZI, secret=dDBxnIYKjdQrEcptFKgxzWBmrMQXrHQh",
        },
      }
    );
    let tracks = [];
    for (let index = 0; index < response.data.tracklist.length; index++) {
      tracks.push({
        id: uuid.v4(),
        title: response.data.tracklist[index].title,
        length: {
          minuets: response.data.tracklist[index].length
            ? response.data.tracklist[index].length.split(":")[0]
            : null,
          seconds: response.data.tracklist[index].length
            ? response.data.tracklist[index].length.split(":")[1]
            : null,
        },
      });
    }

    return {
      album: response.data.title,
      artist: response.data.artists_sort,
      date_published: new Date(response.data.released),
      coverUrl: response.data.thumb,
      tracks: tracks,
    };
  } catch (error) {
    console.error(error);
  }
}

export async function searchDiscogs(album: string, artist: string) {
  try {
    const response = await axios.get(
      `https://api.discogs.com/database/search?type=release&&per_page=15&release_title=${album}&artist=${artist}`,
      {
        headers: {
          Authorization:
            "Discogs key=JuVXyKXnBbVqqyymMKZI, secret=dDBxnIYKjdQrEcptFKgxzWBmrMQXrHQh",
        },
      }
    );
    const records: Array<Record> = [];
    for (const key in response.data.results) {
      const obj: Record = {
        id: response.data.results[key].id,
        album: response.data.results[key].title.split(" - ")[1],
        artist: response.data.results[key].title.split(" - ")[0],
        coverUrl: response.data.results[key].cover_image,
        date_published: response.data.results[key].year,
        country: response.data.results[key].country,
      };
      records.push(obj);
    }
    return records;
  } catch (error) {
    console.error(error);
  }
}
