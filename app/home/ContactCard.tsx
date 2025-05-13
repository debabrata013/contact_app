// import { useState } from 'react';
// import toast from 'react-hot-toast';

// interface Contact {
//   _id: any;
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
// }

// export const ContactCard = ({
//   contact,
//   fetchContacts,
// }: {
//   contact: Contact;
//   fetchContacts: () => void;
// }) => {
//   const [confirm, setConfirm] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [editedContact, setEditedContact] = useState({
//     name: contact.name,
//     email: contact.email,
//     phone: contact.phone,
//   });

//   const handleDelete = async () => {
//     if (!confirm) return setConfirm(true);

//     try {
//       const res = await fetch(`/api/contacts`, {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ contactId: contact._id }),
//       });

//       if (res.ok) {
//         toast.success('Contact deleted');
//         await fetchContacts();
//       } else {
//         const errorData = await res.json();
//         toast.error(errorData.error || 'Delete failed');
//       }
//     } catch (err) {
//       toast.error('Something went wrong');
//     }
//   };

//   const handleEdit = async () => {
//     try {
//       const res = await fetch(`/api/contacts`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           contactId: contact._id,
//           ...editedContact,
//         }),
//       });

//       if (res.ok) {
//         toast.success('Contact updated');
//         await fetchContacts();
//         setEditMode(false);
//       } else {
//         const errorData = await res.json();
//         toast.error(errorData.error || 'Update failed');
//       }
//     } catch (err) {
//       toast.error('Something went wrong');
//     }
//   };

//   return (
//     <div className="border p-4 m-2 rounded shadow-md bg-white">
//       {!editMode ? (
//         <>
//           <h3 className="text-lg font-bold">{contact.name}</h3>
//           <p>📞 {contact.phone}</p>
//           <p>📧 {contact.email}</p>

//           <div className="flex gap-3 mt-2">
//             <a href={`tel:${contact.phone}`}>📞 Call</a>
//             <a href={`https://wa.me/${contact.phone}`} target="_blank">💬 WhatsApp</a>
//             <a href={`mailto:${contact.email}`}>📧 Mail</a>
//             <button
//               onClick={() => setEditMode(true)}
//               className="text-blue-500 hover:underline"
//             >
//               ✏️ Edit
//             </button>
//             <button
//               onClick={handleDelete}
//               className="text-red-500 hover:underline"
//             >
//               {confirm ? '❗ Confirm Delete?' : '🗑️ Delete'}
//             </button>
//           </div>
//         </>
//       ) : (
//         <>
//           <input
//             type="text"
//             value={editedContact.name}
//             onChange={(e) =>
//               setEditedContact({ ...editedContact, name: e.target.value })
//             }
//             placeholder="Name"
//             className="border p-1 my-1 w-full"
//           />
//           <input
//             type="email"
//             value={editedContact.email}
//             onChange={(e) =>
//               setEditedContact({ ...editedContact, email: e.target.value })
//             }
//             placeholder="Email"
//             className="border p-1 my-1 w-full"
//           />
//           <input
//             type="tel"
//             value={editedContact.phone}
//             onChange={(e) =>
//               setEditedContact({ ...editedContact, phone: e.target.value })
//             }
//             placeholder="Phone"
//             className="border p-1 my-1 w-full"
//           />

//           <div className="flex gap-3 mt-2">
//             <button
//               onClick={handleEdit}
//               className="bg-green-500 text-white px-2 py-1 rounded"
//             >
//               ✅ Save
//             </button>
//             <button
//               onClick={() => setEditMode(false)}
//               className="bg-gray-300 text-black px-2 py-1 rounded"
//             >
//               ❌ Cancel
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Pencil, Trash, Phone, Mail, MessageSquare, Save, X, Check, AlertTriangle } from 'lucide-react';

interface Contact {
  _id: any;
  id: string;
  name: string;
  email: string;
  phone: string;
}

export const ContactCard = ({
  contact,
  fetchContacts,
}: {
  contact: Contact;
  fetchContacts: () => void;
}) => {
  const [confirm, setConfirm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedContact, setEditedContact] = useState({
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
  });

  const handleDelete = async () => {
    if (!confirm) return setConfirm(true);

    try {
      const res = await fetch(`/api/contacts`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId: contact._id }),
      });

      if (res.ok) {
        toast.success('Contact deleted');
        await fetchContacts();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Delete failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const handleEdit = async () => {
    try {
      const res = await fetch(`/api/contacts`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId: contact._id,
          ...editedContact,
        }),
      });

      if (res.ok) {
        toast.success('Contact updated');
        await fetchContacts();
        setEditMode(false);
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Update failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditedContact({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    });
  };

  const cancelDelete = () => {
    setConfirm(false);
  };

  // Get initials for avatar
  const getInitials = (name:any) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Generate a consistent color based on the name
  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-pink-500', 'bg-indigo-500', 'bg-yellow-500',
      'bg-teal-500', 'bg-orange-500', 'bg-rose-500'
    ];
    
    const charSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charSum % colors.length];
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
      {!editMode ? (
        <div className="flex flex-col md:flex-row">
          {/* Contact Info Section */}
          <div className="flex items-start p-4 md:p-5 flex-grow">
            <div className={`${getAvatarColor(contact.name)} w-12 h-12 rounded-full flex items-center justify-center text-white font-medium mr-4 flex-shrink-0`}>
              {getInitials(contact.name)}
            </div>
            
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{contact.name}</h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Phone size={16} className="mr-2 text-gray-400" />
                  <span>{contact.phone}</span>
                </div>
                
                <div className="flex items-center">
                  <Mail size={16} className="mr-2 text-gray-400" />
                  <span>{contact.email}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions Section */}
          <div className="flex md:flex-col justify-between items-center border-t md:border-t-0 md:border-l border-gray-100 bg-gray-50 p-3 md:p-4">
            {confirm ? (
              <div className="flex flex-col items-center w-full">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 mb-2">
                  <AlertTriangle size={16} className="text-red-500" />
                </div>
                <span className="text-xs text-red-500 font-medium mb-3">Confirm delete?</span>
                <div className="flex gap-2 w-full">
                  <button
                    onClick={handleDelete}
                    className="flex-1 text-xs bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="flex-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-3 rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex md:flex-col items-center justify-center gap-3 md:gap-4 w-full">
                <a 
                  href={`tel:${contact.phone}`}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                  title="Call"
                >
                  <Phone size={16} />
                </a>
                
                <a 
                  href={`https://wa.me/${contact.phone}`} 
                  target="_blank"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                  title="WhatsApp"
                >
                  <MessageSquare size={16} />
                </a>
                
                <a 
                  href={`mailto:${contact.email}`}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                  title="Email"
                >
                  <Mail size={16} />
                </a>
                
                <div className="w-full border-t border-gray-200 pt-3 mt-1 flex gap-2 md:flex-col">
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-2 rounded transition-colors"
                  >
                    <Pencil size={14} />
                    <span>Edit</span>
                  </button>
                  
                  <button
                    onClick={() => setConfirm(true)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-2 rounded transition-colors"
                  >
                    <Trash size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-5">
          <div className="flex items-center mb-4">
            <div className={`${getAvatarColor(contact.name)} w-10 h-10 rounded-full flex items-center justify-center text-white font-medium mr-3 flex-shrink-0`}>
              {getInitials(contact.name)}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Edit Contact</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={editedContact.name}
                onChange={(e) => setEditedContact({ ...editedContact, name: e.target.value })}
                placeholder="Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={editedContact.email}
                onChange={(e) => setEditedContact({ ...editedContact, email: e.target.value })}
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={editedContact.phone}
                onChange={(e) => setEditedContact({ ...editedContact, phone: e.target.value })}
                placeholder="Phone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleEdit}
                className="flex items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
              >
                <Save size={16} />
                <span>Save Changes</span>
              </button>
              
              <button
                onClick={cancelEdit}
                className="flex items-center justify-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded transition-colors"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};