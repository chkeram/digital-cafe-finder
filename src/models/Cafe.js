export class Cafe {
  constructor({
    id,
    name,
    address,
    latitude,
    longitude,
    rating = 0,
    upvotes = 0,
    downvotes = 0,
    wifiQuality = 'good',
    powerOutlets = 'available',
    noiseLevel = 'moderate',
    foodQuality = 'good',
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    this.rating = rating;
    this.upvotes = upvotes;
    this.downvotes = downvotes;
    this.wifiQuality = wifiQuality;
    this.powerOutlets = powerOutlets;
    this.noiseLevel = noiseLevel;
    this.foodQuality = foodQuality;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Calculate dynamic rating based on upvotes and downvotes
  get dynamicRating() {
    const totalVotes = this.upvotes + this.downvotes;
    if (totalVotes === 0) return 0;
    return Math.round((this.upvotes / totalVotes) * 100);
  }

  // Update rating based on new vote
  updateVote(type) {
    if (type === 'upvote') {
      this.upvotes++;
    } else if (type === 'downvote') {
      this.downvotes++;
    }
    this.rating = this.dynamicRating;
    this.updatedAt = new Date().toISOString();
  }
}
