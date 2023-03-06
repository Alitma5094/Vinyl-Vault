import axios from "axios";
import { Alert } from "react-native";
import uuid from "react-native-uuid";

function showError(error) {
  console.error(error);
  Alert.alert("Error", "Error fetching records. Please try again");
}

export async function searchDiscogsBarcode(barcode) {
  try {
    const response = await axios.get(
      "https://api.discogs.com/database/search?type=release&barcode=" + barcode,
      {
        headers: {
          Authorization:
            "Discogs key=JuVXyKXnBbVqqyymMKZI, secret=dDBxnIYKjdQrEcptFKgxzWBmrMQXrHQh",
        },
      }
    );
    const records = [];
    for (const key in response.data.results) {
      const obj = {
        id: response.data.results[key].id,
        title: response.data.results[key].title.split(" - ")[1],
        artist: response.data.results[key].title.split(" - ")[0],
        coverUrl: response.data.results[key].cover_image,
        year: response.data.results[key].year,
        country: response.data.results[key].country,
      };
      records.push(obj);
    }
    return records;
  } catch (error) {
    showError(error);
  }
}

export async function fetchDiscogsRecord(recordId) {
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
    tracks = [];
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

    const record = {
      album: response.data.title,
      artist: response.data.artists_sort,
      date_published: new Date(response.data.released),
      coverUrl: response.data.thumb,
      tracks: tracks,
    };
    return record;
  } catch (error) {
    showError(error);
  }
}

export async function searchDiscogs(album, artist) {
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
    const records = [];
    for (const key in response.data.results) {
      const obj = {
        id: response.data.results[key].id,
        title: response.data.results[key].title.split(" - ")[1],
        artist: response.data.results[key].title.split(" - ")[0],
        coverUrl: response.data.results[key].cover_image,
        year: response.data.results[key].year,
        country: response.data.results[key].country,
      };
      records.push(obj);
    }
    return records;
  } catch (error) {
    showError(error);
  }
}
