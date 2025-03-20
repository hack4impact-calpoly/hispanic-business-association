export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800">Business Application Page Coming Soon</h1>
    </div>
  );
}
// "use client";

// import { useState } from "react";
// import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
// import axios from "axios";

// export default function Page() {
//   const [formData, setFormData] = useState({
//     businessName: "",
//     businessType: "",
//     businessOwner: "",
//     website: "",
//     address: {
//       street: "",
//       city: "",
//       state: "",
//       zip: "",
//       county: "",
//     },
//     pointOfContact: {
//       name: "",
//       phoneNumber: "",
//       email: "",
//     },
//     socialMediaHandles: {
//       IG: "",
//       twitter: "",
//       FB: "",
//     },
//     description: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     const keys = name.split("."); // Split the name to handle nested fields

//     if (keys.length === 1) {
//       // Top-level key (e.g., businessName)
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     } else if (keys.length === 2) {
//       // Nested key (e.g., address.street or pointOfContact.name)
//       const [parentKey, nestedKey] = keys;

//       setFormData((prev) => ({
//         ...prev,
//         [parentKey]: {
//           ...prev[parentKey as keyof FormData],
//           [nestedKey]: value,
//         },
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log(formData);
//     try {
//       const response = await axios.post("/api/business", formData, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       console.log("Form submitted successfully:", response.data);
//     } catch (error) {
//       console.error("Error submitting form:", error);
//     }
//   };

//   return (
//     <ResponsiveLayout title="Create a Business">
//       <div className="flex flex-col md:flex-row md:justify-center md:items-end min-h-[calc(100vh-200px)] bg-white gap-6 md:gap-x-28 p-4 md:pb-20">
//         <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6">
//           <div>
//             <label htmlFor="businessName" className="block font-medium">
//               Business Name
//             </label>
//             <input
//               type="text"
//               id="businessName"
//               name="businessName"
//               value={formData.businessName}
//               onChange={handleChange}
//               required
//               className="mt-2 p-2 border rounded w-full"
//             />
//           </div>

//           <div>
//             <label htmlFor="businessType" className="block font-medium">
//               Business Type
//             </label>
//             <input
//               type="text"
//               id="businessType"
//               name="businessType"
//               value={formData.businessType}
//               onChange={handleChange}
//               required
//               className="mt-2 p-2 border rounded w-full"
//             />
//           </div>

//           <div>
//             <label htmlFor="businessOwner" className="block font-medium">
//               Business Owner
//             </label>
//             <input
//               type="text"
//               id="businessOwner"
//               name="businessOwner"
//               value={formData.businessOwner}
//               onChange={handleChange}
//               required
//               className="mt-2 p-2 border rounded w-full"
//             />
//           </div>

//           <div>
//             <label htmlFor="website" className="block font-medium">
//               Website
//             </label>
//             <input
//               type="url"
//               id="website"
//               name="website"
//               value={formData.website}
//               onChange={handleChange}
//               required
//               className="mt-2 p-2 border rounded w-full"
//             />
//           </div>

//           <div>
//             <label htmlFor="address.street" className="block font-medium">
//               Street Address
//             </label>
//             <input
//               type="text"
//               id="address.street"
//               name="address.street"
//               value={formData.address.street}
//               onChange={handleChange}
//               required
//               className="mt-2 p-2 border rounded w-full"
//             />
//           </div>

//           <div>
//             <label htmlFor="address.city" className="block font-medium">
//               City
//             </label>
//             <input
//               type="text"
//               id="address.city"
//               name="address.city"
//               value={formData.address.city}
//               onChange={handleChange}
//               required
//               className="mt-2 p-2 border rounded w-full"
//             />
//           </div>

//           <div>
//             <label htmlFor="address.state" className="block font-medium">
//               State
//             </label>
//             <input
//               type="text"
//               id="address.state"
//               name="address.state"
//               value={formData.address.state}
//               onChange={handleChange}
//               required
//               className="mt-2 p-2 border rounded w-full"
//             />
//           </div>

//           <div>
//             <label htmlFor="address.zip" className="block font-medium">
//               ZIP Code
//             </label>
//             <input
//               type="number"
//               id="address.zip"
//               name="address.zip"
//               value={formData.address.zip}
//               onChange={handleChange}
//               required
//               className="mt-2 p-2 border rounded w-full"
//             />
//           </div>

//           <div>
//             <label htmlFor="address.county" className="block font-medium">
//               County
//             </label>
//             <input
//               type="text"
//               id="address.county"
//               name="address.county"
//               value={formData.address.county}
//               onChange={handleChange}
//               required
//               className="mt-2 p-2 border rounded w-full"
//             />
//           </div>

//           <div>
//             <label htmlFor="pointOfContact.name" className="block font-medium">
//               Contact Name
//             </label>
//             <input
//               type="text"
//               id="pointOfContact.name"
//               name="pointOfContact.name"
//               value={formData.pointOfContact.name}
//               onChange={handleChange}
//               required
//               className="mt-2 p-2 border rounded w-full"
//             />
//           </div>

//           <div>
//             <label htmlFor="pointOfContact.phoneNumber" className="block font-medium">
//               Phone Number
//             </label>
//             <input
//               type="tel"
//               id="pointOfContact.phoneNumber"
//               name="pointOfContact.phoneNumber"
//               value={formData.pointOfContact.phoneNumber}
//               onChange={handleChange}
//               required
//               className="mt-2 p-2 border rounded w-full"
//             />
//           </div>

//           <div>
//             <label htmlFor="pointOfContact.email" className="block font-medium">
//               Email Address
//             </label>
//             <input
//               type="email"
//               id="pointOfContact.email"
//               name="pointOfContact.email"
//               value={formData.pointOfContact.email}
//               onChange={handleChange}
//               required
//               className="mt-2 p-2 border rounded w-full"
//             />
//           </div>

//           <div>
//             <label htmlFor="socialMediaHandles.IG" className="block font-medium">
//               Instagram Handle
//             </label>
//             <input
//               type="text"
//               id="socialMediaHandles.IG"
//               name="socialMediaHandles.IG"
//               value={formData.socialMediaHandles.IG}
//               onChange={handleChange}
//               className="mt-2 p-2 border rounded w-full"
//             />
//           </div>

//           <div>
//             <label htmlFor="socialMediaHandles.twitter" className="block font-medium">
//               Twitter Handle
//             </label>
//             <input
//               type="text"
//               id="socialMediaHandles.twitter"
//               name="socialMediaHandles.twitter"
//               value={formData.socialMediaHandles.twitter}
//               onChange={handleChange}
//               className="mt-2 p-2 border rounded w-full"
//             />
//           </div>

//           <div>
//             <label htmlFor="socialMediaHandles.FB" className="block font-medium">
//               Facebook Handle
//             </label>
//             <input
//               type="text"
//               id="socialMediaHandles.FB"
//               name="socialMediaHandles.FB"
//               value={formData.socialMediaHandles.FB}
//               onChange={handleChange}
//               className="mt-2 p-2 border rounded w-full"
//             />
//           </div>

//           <div>
//             <label htmlFor="description" className="block font-medium">
//               Business Description
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               required
//               className="mt-2 p-2 border rounded w-full"
//             />
//           </div>

//           <div>
//             <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded">
//               Create Business
//             </button>
//           </div>
//         </form>
//       </div>
//     </ResponsiveLayout>
//   );
// }
