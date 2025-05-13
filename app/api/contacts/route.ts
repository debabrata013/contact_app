import { NextResponse } from 'next/server';
import Contact from '@/models/Contact';
import { connect } from '@/utils/db';

// ➕ Create Contact
export async function POST(req: Request) {
  try {
    await connect();
    const { userId, name, email, phone } = await req.json();
    const newContact = await Contact.create({ userId, name, email, phone });
    return NextResponse.json(newContact);
  } catch (err) {
    return NextResponse.json({ error: 'Error creating contact' }, { status: 500 });
  }
}

// 📥 Get All Contacts of a User
export async function GET(req: Request) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });

    const contacts = await Contact.find({ userId });
    return NextResponse.json(contacts);
  } catch (err) {
    return NextResponse.json({ error: 'Error fetching contacts' }, { status: 500 });
  }
}

// ✏️ Update Contact
export async function PUT(req: Request) {
  try {
    await connect();
    const { contactId, name, email, phone } = await req.json();

    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { name, email, phone },
      { new: true }
    );

    if (!updatedContact) return NextResponse.json({ error: 'Contact not found' }, { status: 404 });

    return NextResponse.json(updatedContact);
  } catch (err) {
    return NextResponse.json({ error: 'Error updating contact' }, { status: 500 });
  }
}

// ❌ Delete Contact
export async function DELETE(req: Request) {
  try {
    await connect();
    const { contactId } = await req.json();

    const deletedContact = await Contact.findByIdAndDelete(contactId);

    if (!deletedContact) return NextResponse.json({ error: 'Contact not found' }, { status: 404 });

    return NextResponse.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Error deleting contact' }, { status: 500 });
  }
}
