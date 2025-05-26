// const { data, error, isPending, isSuccess, isError } = createQuery<
//   ErrorType,
//   ReturnType
// >({
//   queryFn: () => { },
//   queryKeys: ["key_1", "key_2", "etc..."],
//   onPending: () => { },
//   onSuccess: () => { },
//   onError: () => { },
// });

// function updateUser(userData) {
//   // Perform the mutation logic, e.g., make an API request to update the user
//   const response = await fetch('/api/users', {
//     method: 'PUT',
//     body: JSON.stringify(userData),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   if (!response.ok) {
//     throw new Error('Failed to update user');
//   }

//   return response.json();
// }

// const { data, error, mutate, isPending, isSuccess, isError } = createMuation<ErrorType, ReturnType>({
//   mutationFn: updateUser,
//   queryKeys: [["key_1", "key_2", "etc..."],
//   onPending: () => { },
//   onSuccess: () => { },
//   onError: () => { },
// })

// function onsubmit() {
//   mutate(formData)
// }
