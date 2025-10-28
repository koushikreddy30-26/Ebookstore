const mongoose = require('mongoose');
const Book = require('./models/Book');
require('dotenv').config();

const seedBooks = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Connected to MongoDB');
    } else {
      console.log('MONGO_URI not set, skipping seeding');
      return;
    }

    // Clear existing books
    await Book.deleteMany({});
    console.log('Cleared existing books');

    const booksData = [
      { title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Romance' },
      { title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction' },
      { title: '1984', author: 'George Orwell', genre: 'Fiction' },
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Fiction' },
      { title: 'Moby-Dick', author: 'Herman Melville', genre: 'Fiction' },
      { title: 'Jane Eyre', author: 'Charlotte Brontë', genre: 'Romance' },
      { title: 'Wuthering Heights', author: 'Emily Brontë', genre: 'Romance' },
      { title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', genre: 'Fiction' },
      { title: 'War and Peace', author: 'Leo Tolstoy', genre: 'Fiction' },
      { title: 'The Catcher in the Rye', author: 'J.D. Salinger', genre: 'Fiction' },
      { title: 'The Kite Runner', author: 'Khaled Hosseini', genre: 'Fiction' },
      { title: 'Life of Pi', author: 'Yann Martel', genre: 'Fiction' },
      { title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Fiction' },
      { title: 'The Book Thief', author: 'Markus Zusak', genre: 'Fiction' },
      { title: 'The Fault in Our Stars', author: 'John Green', genre: 'Romance' },
      { title: 'The Road', author: 'Cormac McCarthy', genre: 'Fiction' },
      { title: 'The Lovely Bones', author: 'Alice Sebold', genre: 'Fiction' },
      { title: 'A Thousand Splendid Suns', author: 'Khaled Hosseini', genre: 'Fiction' },
      { title: 'The Time Traveler\'s Wife', author: 'Audrey Niffenegger', genre: 'Romance' },
      { title: 'Gone Girl', author: 'Gillian Flynn', genre: 'Mystery' },
      { title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', genre: 'Fantasy' },
      { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy' },
      { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', genre: 'Fantasy' },
      { title: 'A Game of Thrones', author: 'George R.R. Martin', genre: 'Fantasy' },
      { title: 'The Chronicles of Narnia', author: 'C.S. Lewis', genre: 'Fantasy' },
      { title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi' },
      { title: 'Ender\'s Game', author: 'Orson Scott Card', genre: 'Sci-Fi' },
      { title: 'The Hunger Games', author: 'Suzanne Collins', genre: 'Sci-Fi' },
      { title: 'Divergent', author: 'Veronica Roth', genre: 'Sci-Fi' },
      { title: 'The Maze Runner', author: 'James Dashner', genre: 'Sci-Fi' },
      { title: 'The Power of Habit', author: 'Charles Duhigg', genre: 'Non-Fiction' },
      { title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help' },
      { title: 'Think and Grow Rich', author: 'Napoleon Hill', genre: 'Self-Help' },
      { title: 'The 7 Habits of Highly Effective People', author: 'Stephen R. Covey', genre: 'Self-Help' },
      { title: 'How to Win Friends and Influence People', author: 'Dale Carnegie', genre: 'Self-Help' },
      { title: 'Man\'s Search for Meaning', author: 'Viktor E. Frankl', genre: 'Non-Fiction' },
      { title: 'The Subtle Art of Not Giving a F*ck', author: 'Mark Manson', genre: 'Self-Help' },
      { title: 'You Are a Badass', author: 'Jen Sincero', genre: 'Self-Help' },
      { title: 'Deep Work', author: 'Cal Newport', genre: 'Non-Fiction' },
      { title: 'Ikigai', author: 'Héctor García & Francesc Miralles', genre: 'Non-Fiction' },
      { title: 'Rich Dad Poor Dad', author: 'Robert T. Kiyosaki', genre: 'Non-Fiction' },
      { title: 'The Lean Startup', author: 'Eric Ries', genre: 'Non-Fiction' },
      { title: 'Zero to One', author: 'Peter Thiel', genre: 'Non-Fiction' },
      { title: 'The Intelligent Investor', author: 'Benjamin Graham', genre: 'Non-Fiction' },
      { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', genre: 'Non-Fiction' },
      { title: 'Outliers', author: 'Malcolm Gladwell', genre: 'Non-Fiction' },
      { title: 'Freakonomics', author: 'Steven D. Levitt & Stephen J. Dubner', genre: 'Non-Fiction' },
      { title: 'Start with Why', author: 'Simon Sinek', genre: 'Non-Fiction' },
      { title: 'Principles', author: 'Ray Dalio', genre: 'Non-Fiction' },
      { title: 'The Psychology of Money', author: 'Morgan Housel', genre: 'Non-Fiction' },
      { title: 'Clean Code', author: 'Robert C. Martin', genre: 'Non-Fiction' },
      { title: 'The Pragmatic Programmer', author: 'Andrew Hunt & David Thomas', genre: 'Non-Fiction' },
      { title: 'Code Complete', author: 'Steve McConnell', genre: 'Non-Fiction' },
      { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', genre: 'Non-Fiction' },
      { title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell & Peter Norvig', genre: 'Non-Fiction' },
      { title: 'Design Patterns', author: 'Erich Gamma et al.', genre: 'Non-Fiction' },
      { title: 'Structure and Interpretation of Computer Programs', author: 'Harold Abelson', genre: 'Non-Fiction' },
      { title: 'Don\'t Make Me Think', author: 'Steve Krug', genre: 'Non-Fiction' },
      { title: 'The Mythical Man-Month', author: 'Frederick P. Brooks Jr.', genre: 'Non-Fiction' },
      { title: 'Deep Learning', author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville', genre: 'Non-Fiction' },
      { title: 'Meditations', author: 'Marcus Aurelius', genre: 'Non-Fiction' },
      { title: 'Beyond Good and Evil', author: 'Friedrich Nietzsche', genre: 'Non-Fiction' },
      { title: 'The Republic', author: 'Plato', genre: 'Non-Fiction' },
      { title: 'The Art of War', author: 'Sun Tzu', genre: 'Non-Fiction' },
      { title: 'Flow', author: 'Mihaly Csikszentmihalyi', genre: 'Non-Fiction' },
      { title: 'Blink', author: 'Malcolm Gladwell', genre: 'Non-Fiction' },
      { title: 'The Happiness Hypothesis', author: 'Jonathan Haidt', genre: 'Non-Fiction' },
      { title: 'Emotional Intelligence', author: 'Daniel Goleman', genre: 'Non-Fiction' },
      { title: 'The Courage to Be Disliked', author: 'Ichiro Kishimi & Fumitake Koga', genre: 'Non-Fiction' },
      { title: 'The Da Vinci Code', author: 'Dan Brown', genre: 'Mystery' },
      { title: 'Angels & Demons', author: 'Dan Brown', genre: 'Mystery' },
      { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', genre: 'Mystery' },
      { title: 'Sherlock Holmes: The Complete Novels', author: 'Arthur Conan Doyle', genre: 'Mystery' },
      { title: 'The Silent Patient', author: 'Alex Michaelides', genre: 'Mystery' },
      { title: 'Big Little Lies', author: 'Liane Moriarty', genre: 'Mystery' },
      { title: 'The Woman in the Window', author: 'A.J. Finn', genre: 'Mystery' },
      { title: 'In the Woods', author: 'Tana French', genre: 'Mystery' },
      { title: 'The Shining', author: 'Stephen King', genre: 'Horror' },
      { title: 'Misery', author: 'Stephen King', genre: 'Horror' },
      { title: 'Me Before You', author: 'Jojo Moyes', genre: 'Romance' },
      { title: 'The Notebook', author: 'Nicholas Sparks', genre: 'Romance' },
      { title: 'Dear John', author: 'Nicholas Sparks', genre: 'Romance' },
      { title: 'P.S. I Love You', author: 'Cecelia Ahern', genre: 'Romance' },
      { title: 'Call Me by Your Name', author: 'André Aciman', genre: 'Romance' },
      { title: 'It Ends with Us', author: 'Colleen Hoover', genre: 'Romance' },
      { title: 'Ugly Love', author: 'Colleen Hoover', genre: 'Romance' },
      { title: 'After', author: 'Anna Todd', genre: 'Romance' },
      { title: 'The Rosie Project', author: 'Graeme Simsion', genre: 'Romance' },
      { title: 'One Day', author: 'David Nicholls', genre: 'Romance' },
      { title: 'The Diary of a Young Girl', author: 'Anne Frank', genre: 'Biography' },
      { title: 'Becoming', author: 'Michelle Obama', genre: 'Biography' },
      { title: 'Steve Jobs', author: 'Walter Isaacson', genre: 'Biography' },
      { title: 'Elon Musk', author: 'Walter Isaacson', genre: 'Biography' },
      { title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', genre: 'Biography' },
      { title: 'Long Walk to Freedom', author: 'Nelson Mandela', genre: 'Biography' },
      { title: 'Educated', author: 'Tara Westover', genre: 'Biography' },
      { title: 'Shoe Dog', author: 'Phil Knight', genre: 'Biography' },
      { title: 'I Am Malala', author: 'Malala Yousafzai', genre: 'Biography' },
      { title: 'When Breath Becomes Air', author: 'Paul Kalanithi', genre: 'Biography' }
    ];

    const sampleBooks = booksData.map((book, index) => {
      const images = [
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop'
      ];
      return {
        ...book,
        description: `A captivating ${book.genre} book by ${book.author}.`,
        price: parseFloat((Math.random() * 15 + 5).toFixed(2)), // 5-20
        imageUrl: images[index % images.length],
        stock: Math.floor(Math.random() * 91) + 10 // 10-100
      };
    });

    await Book.insertMany(sampleBooks);
    console.log('100 sample books added successfully');

    process.exit();
  } catch (error) {
    console.error('Error seeding books:', error);
    process.exit(1);
  }
};

seedBooks();
