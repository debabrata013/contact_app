// "use client";
// import { useUser, SignOutButton } from "@clerk/nextjs";
// import { useEffect, useState } from "react";
// import AddContactForm from "./AddContactForm";
// import { ContactCard } from "./ContactCard";

// const Home = () => {
//   const { user } = useUser();
//   const [contacts, setContacts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   const fetchContacts = async () => {
//     if (!user) return;
//     const res = await fetch(`/api/contacts?userId=${user.id}`);
//     const data = await res.json();
//     setContacts(data);
//   };

//   useEffect(() => {
//     fetchContacts();
//   }, [user]);

//   const filteredContacts = contacts.filter((contact) =>
//     contact.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="p-4 max-w-xl mx-auto">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-xl font-bold">📒 Your Contacts</h1>
//         <SignOutButton>
//           <button className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
//         </SignOutButton>
//       </div>

//       {user && (
//         <AddContactForm userId={user.id} fetchContacts={fetchContacts} />
//       )}

//       <input
//         type="text"
//         placeholder="🔍 Search contact..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="w-full p-2 mb-4 border rounded"
//       />

//       <div className="grid gap-4">
//         {filteredContacts.map((c) => (
//           <ContactCard key={c.id} contact={c} fetchContacts={fetchContacts} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Home;
"use client";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import AddContactForm from "./AddContactForm";
import { ContactCard } from "./ContactCard";
import { Search, PlusCircle, X, User } from "lucide-react";

const Home = () => {
  const { user } = useUser();
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingContact, setIsAddingContact] = useState(false);

  const fetchContacts = async () => {
    if (!user) return;
    const res = await fetch(`/api/contacts?userId=${user.id}`);
    const data = await res.json();
    setContacts(data);
  };

  useEffect(() => {
    fetchContacts();
  }, [user]);

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="mr-2">📒</span>
            Contacts
          </h1>
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center text-sm">
                <span className="text-gray-500">Hello, </span>
                <span className="font-medium ml-1">{user.firstName || user.username}</span>
              </div>
              <SignOutButton>
                <button className="bg-red-500 hover:bg-red-600 transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Logout
                </button>
              </SignOutButton>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Search and Add Contact Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button 
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <button
            onClick={() => setIsAddingContact(!isAddingContact)}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 transition-colors text-white px-4 py-3 rounded-lg font-medium"
          >
            {isAddingContact ? (
              <>
                <X size={18} />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <PlusCircle size={18} />
                <span>Add Contact</span>
              </>
            )}
          </button>
        </div>

        {/* Add Contact Form */}
        {isAddingContact && user && (
          <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-medium mb-4 text-gray-800">New Contact</h2>
            <AddContactForm 
              userId={user.id} 
              fetchContacts={fetchContacts} 
              onSuccess={() => setIsAddingContact(false)}
            />
          </div>
        )}

        {/* Contacts List */}
        {filteredContacts.length > 0 ? (
          <div className="grid gap-4">
            {filteredContacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} fetchContacts={fetchContacts} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gray-100 rounded-full">
                <User size={32} className="text-gray-400" />
              </div>
            </div>
            {contacts.length === 0 ? (
              <p className="text-gray-500">No contacts found. Add your first contact!</p>
            ) : (
              <p className="text-gray-500">No matching contacts found. Try a different search.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;