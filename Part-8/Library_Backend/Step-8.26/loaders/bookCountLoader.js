import DataLoader from 'dataloader';
import Book from '../models/book.js';

export const bookCountLoader = new DataLoader(async (authorIds) => {
  // Fetch all books where author is in authorIds
  const books = await Book.find({ author: { $in: authorIds } });

  // Count books per author
  const countsMap = {};
  authorIds.forEach(id => countsMap[id.toString()] = 0);
  books.forEach(book => {
    const id = book.author.toString();
    countsMap[id] = (countsMap[id] || 0) + 1;
  });

  // Return counts in the same order as authorIds
  return authorIds.map(id => countsMap[id.toString()]);
});
