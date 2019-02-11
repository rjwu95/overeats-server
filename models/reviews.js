exports.reviewSchema = {
  name: String,
  rating: Number,
  content: String,
  Date: { type: Date, default: Date.now }
};
