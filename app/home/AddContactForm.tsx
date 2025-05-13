
// // Form component for adding a new contact
// import React, { useState } from 'react';
// import { useUser } from '@clerk/nextjs';
// import { useRouter } from 'next/router';

// interface Contact {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
// }

// const AddContactForm: React.FC<{ userId: string; fetchContacts: () => void; }> = ({ userId, fetchContacts }) => {
//   const [contact, setContact] = useState<Contact>({
//     id: '',
//     name: '',
//     email: '',
//     phone: ''
//   });
//   const user   = useUser();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // TODO: Add contact handling logic
// await fetch('/api/contacts', {
//   method: 'POST',
//   body: JSON.stringify({
//     userId: user.user?.id,
//     name: contact.name,
//     email: contact.email,
//     phone: contact.phone
//   }),
//   headers: { 'Content-Type': 'application/json' },
// });

//     console.log('Contact submitted:', contact);
//     fetchContacts();
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setContact(prevContact => ({
//       ...prevContact,
//       [name]: value
//     }));
//   };

//   return (
//     <form onSubmit={handleSubmit} className="add-contact-form">
//       <div className="form-group">
//         <label htmlFor="name">Name:</label>
//         <input
//           type="text"
//           id="name"
//           name="name"
//           value={contact.name}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       <div className="form-group">
//         <label htmlFor="email">Email:</label>
//         <input
//           type="email"
//           id="email"
//           name="email"
//           value={contact.email}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       <div className="form-group">
//         <label htmlFor="phone">Phone:</label>
//         <input
//           type="tel"
//           id="phone"
//           name="phone"
//           value={contact.phone}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       <button type="submit">Add Contact</button>
//     </form>
//   );
// };

// export default AddContactForm;
"use client";
import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Plus, Loader2 } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AddContactFormProps {
  userId: string;
  fetchContacts: () => void;
  onSuccess?: () => void;
}

const AddContactForm: React.FC<AddContactFormProps> = ({ 
  userId, 
  fetchContacts,
  onSuccess 
}) => {
  const [contact, setContact] = useState<Contact>({
    id: '',
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        body: JSON.stringify({
          userId: user?.id || userId,
          name: contact.name,
          email: contact.email,
          phone: contact.phone
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // Reset form
        setContact({
          id: '',
          name: '',
          email: '',
          phone: ''
        });
        
        // Notify success
        toast.success('Contact added successfully');
        
        // Refresh contacts list
        await fetchContacts();
        
        // Call optional success callback (to close form, etc)
        if (onSuccess) {
          onSuccess();
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to add contact');
      }
    } catch (err) {
      toast.error('Something went wrong');
      console.error('Error adding contact:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContact(prevContact => ({
      ...prevContact,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black">
      <div className="form-group md:col-span-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-100 mb-1">
          Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <User size={16} />
          </div>
          <input
            type="text"
            id="name"
            name="name"
            value={contact.name}
            onChange={handleChange}
            placeholder="Enter full name"
            required
            className="w-full pl-10 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email" className="block text-sm font-medium text-gray-1100 mb-1">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white">
            <Mail size={16} />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={contact.email}
            onChange={handleChange}
            placeholder="email@example.com"
            required
            className="w-full pl-10 py-2 px-3 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-100 mb-1">
          Phone
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white">
            <Phone size={16} />
          </div>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={contact.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            required
            className="w-full pl-10 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="form-group md:col-span-2 mt-2">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Adding...</span>
            </>
          ) : (
            <>
              <Plus size={18} />
              <span>Add Contact</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddContactForm;