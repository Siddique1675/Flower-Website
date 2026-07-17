import { BlogPost } from "./types";

// Import our beautiful pre-generated assets so Vite bundles them elegantly
import cherryBlossomImg from "./assets/images/cherry_blossom_macro_1784286219185.jpg";
import midnightOrchidImg from "./assets/images/midnight_orchid_1784286238965.jpg";
import wildflowerMeadowImg from "./assets/images/wildflower_meadow_1784286256377.jpg";

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "The Language of Cherry Blossoms: Hanami and the Art of Transience",
    subtitle: "Understanding the ephemeral beauty that captures the heart of spring",
    author: "Flora Silverwood",
    date: "July 15, 2026",
    readTime: "5 min read",
    image: cherryBlossomImg,
    tags: ["spring", "philosophy", "sakura", "symbolism"],
    aestheticColor: "#FDA4AF", // Delicate pink
    likes: 142,
    careWatering: "Keep soil moist but never soggy; mist foliage lightly during active spring blooming.",
    careLight: "Thrives in bright, dappled sunlight or full, gentle morning sun.",
    careSoil: "Loves rich, well-aerated loamy soil with plenty of organic leaf mulch.",
    comments: [
      {
        id: "c1",
        author: "Aria Woods",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
        text: "This article makes me want to drop everything and sit under a sakura tree. Exquisite writing!",
        date: "July 16, 2026",
      },
      {
        id: "c2",
        author: "Julian Thorne",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
        text: "Beautifully captured. The connection between the fleeting petals and Zen philosophy is so deep.",
        date: "July 16, 2026",
      },
    ],
    content: `# The Language of Cherry Blossoms: Hanami and the Art of Transience

Every spring, a wave of pale pink and white sweeps across Japan and parts of the western world. The arrival of the **Cherry Blossom**, or *Sakura*, is not merely a seasonal change; it is an absolute cultural phenomenon. Families, friends, and solitary wanderers gather beneath the branches to practice *Hanami*—literally, "flower viewing."

But why does a single blossom hold such immense power over the human soul?

> "The cherry blossom is a beautiful, fleeting reminder of the preciousness of life. It bloom. It shines. It fades."

## The Zen Philosophy of Impermanence
At the core of the cherry blossom's adoration is the concept of *Mono no Aware*—a Japanese phrase that translates roughly to **"the beautiful, melancholic awareness of the transience of all things."** 

Unlike evergreen trees that maintain a steady presence, the Sakura bursts into stunning visual poetry for a mere ten days, only to scatter in the spring breeze. This short life cycle mirrors our own mortal journey. By celebrating the flower, we learn to accept the fleeting nature of joy, sorrow, and time.

## An Elegant Sakura Care Card
If you are lucky enough to host a young cherry blossom tree or miniature bonsai in your garden, remember:
1. **The Sun's Embrace:** They demand at least six hours of bright, direct sunlight daily to yield their signature pink canopy.
2. **Pruning with Respect:** Prune only in mid-summer once the blooms have fully fallen. Pruning too early invites infections.
3. **Moisture Balance:** Ensure excellent drainage. Cherry blossoms detest cold, wet roots, which can lead to fungal rot.

## Cultural Myth & Legends
In ancient folklore, it was believed that cherry blossoms housed the spirits of agricultural deities. When the petals fell, it was the gods blessing the soil, signaling that the season for planting rice had arrived. Today, they symbolize new beginnings, making them a fixture in weddings and academic graduations.`,
  },
  {
    id: "2",
    title: "Mysteries of the Midnight Orchid: Luxury in Shadow",
    subtitle: "A journey into the twilight jungle where the rarest violet petals bloom",
    author: "Sage Petalwood",
    date: "July 12, 2026",
    readTime: "6 min read",
    image: midnightOrchidImg,
    tags: ["mysticism", "rare-flowers", "orchids", "jungle"],
    aestheticColor: "#C084FC", // Purple
    likes: 98,
    careWatering: "Water sparingly, allowing the roots to thoroughly dry out before re-introducing hydration.",
    careLight: "Indirect, filtered light only. Avoid direct afternoon sun at all costs.",
    careSoil: "Extremely loose bark mix with sphagnum moss for maximal air circulation.",
    comments: [
      {
        id: "c3",
        author: "Daphne Vance",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
        text: "I've been trying to keep a purple orchid alive for months. These tips on air circulation are exactly what I needed!",
        date: "July 13, 2026",
      },
    ],
    content: `# Mysteries of the Midnight Orchid: Luxury in Shadow

In the deepest recesses of the cloud forests, where mist weaves through giant ferns, lives the **Midnight Orchid**. Clothed in shades of deep royal purple so rich they border on absolute black, these flowers are the undisputed royalty of the nocturnal botanical world.

Unlike common flora that rely on bright sunrays to declare their presence, the Midnight Orchid is a master of understatement, thriving in the cool, humid shade of the canopy.

## The Epiphytic Lifestyle
To understand the orchid is to understand that they are *epiphytic*—they do not grow in soil. Instead, they cling to the bark of trees, using their thick, silvery roots to drink moisture and nutrients directly from the heavy jungle air. 

> "An orchid does not compete with its neighbors. It climbs above them, anchoring itself in the bark of giants, drinking the morning fog."

## Masterclass on Indoor Orchid Nurturing
Bringing a Midnight Orchid into your home is an act of curation. To simulate their tropical homeland, adhere strictly to these steps:
* **The Potting Lie:** Never plant an orchid in standard potting soil. It will suffocate. Use a dedicated orchid bark mix consisting of chunky fir bark, charcoal, and perlite.
* **The Soak-and-Dry Cycle:** Water by soaking the entire inner plastic pot in lukewarm water for ten minutes, then letting it drain completely. Never let water accumulate in the crown where the leaves meet.
* **Humidity Mimicry:** Place the pot on a tray filled with pebbles and water. As the water evaporates, it creates a localized micro-climate of humidity that orchids adore.

## Victorian Obsession: Orchidaria
During the 19th century, wealthy Victorians suffered from a luxury craze known as *Orchidelirium*. Collectors risked life and limb in remote jungles to discover rare orchid species, building grand glasshouses specifically to display their dark, enigmatic treasures. To this day, the orchid remains a universal symbol of luxury, refined beauty, and exquisite mystery.`,
  },
  {
    id: "3",
    title: "The Symphony of Wild Meadows: Reclaiming the Unbridled Earth",
    subtitle: "Why leaving lawns behind for wild, native flower meadows is the ultimate act of beauty",
    author: "Jasper Moss",
    date: "July 10, 2026",
    readTime: "4 min read",
    image: wildflowerMeadowImg,
    tags: ["meadows", "ecology", "gardening", "wildflowers"],
    aestheticColor: "#FBBF24", // Golden Yellow
    likes: 210,
    careWatering: "Rely primarily on natural rain; water deeply only during severe, extended summer droughts.",
    careLight: "Requires full, unfiltered, blazing sun to awaken dormant wildflower seeds.",
    careSoil: "Poor, sandy, or stony soil. High nutrients actually encourage aggressive weeds.",
    comments: [
      {
        id: "c4",
        author: "Oliver Green",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
        text: "Yes! Down with manicured lawns! My garden is currently filled with poppies and bees, and it brings me so much joy.",
        date: "July 11, 2026",
      },
    ],
    content: `# The Symphony of Wild Meadows: Reclaiming the Unbridled Earth

For decades, the standard of outdoor aesthetics has been the manicured green lawn—a flat, silent carpet of resource-heavy turf. But across the globe, a beautiful rebellion is taking root. Gardeners, public parks, and estate owners are tossing away their lawnmowers and sowing **wildflower meadows**.

The result? A shifting, buzzing, living tapestry of poppies, chamomile, cornflowers, and wild lavender.

## The Ecological Resurgence
When we swap turf for wildflowers, we aren't just changing the visual view; we are restoring a collapsed ecosystem. 
* **The Pollinator Haven:** Wildflowers offer a feast of high-quality pollen and nectar for native bees, butterflies, and hoverflies.
* **Water Conservators:** Unlike shallow-rooted lawns, native wildflowers develop deep root systems that hold soil together, prevent erosion, and drink far less water.
* **The Living Pest Control:** Meadows invite ladybugs, lacewings, and birds that naturally hunt harmful garden pests, eliminating the need for chemical sprays.

## How to Establish Your Own Pocket Meadow
You don't need acres of land to build a meadow. A sunny corner of your yard or even a large wooden planter is enough:
1. **The Depletion Principle:** Sowing seeds into rich, fertile soil is a mistake. Aggressive turf grasses will outgrow the delicate flowers. Choose an area with poorer soil, or remove the top layer of rich turf.
2. **Native Seed Sowing:** Always purchase seed mixes native to your specific geographic region. Scatter them in early autumn or early spring, pressing them lightly into the dirt rather than burying them.
3. **Patience & Mowing:** Resist the urge to tidy up! Allow the plants to fully dry out and drop their seeds in late autumn before performing a single, high-cut mow.`
  }
];
