import adventurous from "/src/assets/default_images/adventurous.jpg"
import indoor from "/src/assets/default_images/indoor.jpg"
import relaxing from "/src/assets/default_images/relaxing.jpg"
import romantic from "/src/assets/default_images/romantic.jpg"
import stayAtHome from "/src/assets/default_images/stayAtHome.jpg"

export function getDefaultImage(category) {
  switch (category) {
    case "adventurous":
      return adventurous;
    case "indoor":
      return indoor;
    case "relaxing":
      return relaxing;
    case "romantic":
      return romantic;
    case "stayathome":
      return stayAtHome;
    default:
      return indoor;
  }
}
