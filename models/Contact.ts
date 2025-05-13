// models/Contact.ts
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  userId: String, // from Clerk
  name: String,
  email: String,
  phone: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Contact || mongoose.model("Contact", contactSchema);
