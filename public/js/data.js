/**
 * ============================================================
 * DATA.JS — Open Books (GNDEC Library)
 * ============================================================
 * This file contains the complete book database for the library.
 * Each book object includes: id, title, author, price (MRP),
 * rating, category, description, image path, availability flags,
 * section flags (featured, bestSeller, newArrival), and reviews.
 *
 * Categories: Fiction, Non-Fiction, Academic, Self-Help, Children's
 * Total Books: 24
 * ============================================================
 */

const books = [

  /* ========================================
   * FICTION (Books 1-5)
   * ======================================== */
  {
    id: 1,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 350,
    rating: 4.8,
    category: "Fiction",
    description: "A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice. Through the young eyes of Scout and Jem Finch, Harper Lee explores with rich humor and unflinching honesty the irrationality of adult attitudes toward race and class in the Deep South of the 1930s.",
    image: "images/books/book-1.jpg",
    copies: 5,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    reviews: [
      { name: "Ankit Sharma", rating: 5, comment: "A timeless classic that everyone should read. Beautifully written!" },
      { name: "Priya Kaur", rating: 5, comment: "One of the most impactful books I've ever read. Harper Lee is a genius." },
      { name: "Rahul Verma", rating: 4, comment: "Powerful story with deep moral lessons. Highly recommended." }
    ]
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    price: 299,
    rating: 4.7,
    category: "Fiction",
    description: "George Orwell's dystopian masterpiece paints a chilling portrait of a totalitarian society where Big Brother watches every move. Set in a future world of perpetual war, omnipresent government surveillance, and public manipulation, the novel explores themes of truth, freedom, and individuality.",
    image: "images/books/book-2.jpg",
    copies: 3,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    reviews: [
      { name: "Deepak Singh", rating: 5, comment: "Terrifyingly relevant even today. A must-read!" },
      { name: "Simran Kaur", rating: 4, comment: "Thought-provoking and intense. Changed how I see the world." }
    ]
  },
  {
    id: 3,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 275,
    rating: 4.5,
    category: "Fiction",
    description: "Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former love, Daisy Buchanan. A story of decadence, idealism, and the American Dream.",
    image: "images/books/book-3.jpg",
    copies: 4,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    reviews: [
      { name: "Manpreet Kaur", rating: 5, comment: "Beautiful prose and a haunting story. Fitzgerald at his best." },
      { name: "Arjun Patel", rating: 4, comment: "A classic exploration of wealth and desire. Loved it." }
    ]
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    price: 250,
    rating: 4.6,
    category: "Fiction",
    description: "Jane Austen's beloved masterpiece tells the story of Elizabeth Bennet and Mr. Darcy, navigating the complex world of English society, class, and romantic misunderstandings. A witty, elegant novel that explores the themes of love, reputation, and personal growth.",
    image: "images/books/book-4.jpg",
    copies: 6,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    reviews: [
      { name: "Neha Gupta", rating: 5, comment: "A perfect blend of romance, wit, and social commentary." },
      { name: "Ravi Kumar", rating: 4, comment: "Austen's characters feel so real. Timeless storytelling." }
    ]
  },
  {
    id: 5,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    price: 320,
    rating: 4.3,
    category: "Fiction",
    description: "Through the eyes of the cynical yet sensitive Holden Caulfield, Salinger explores themes of teenage angst, alienation, and the loss of innocence. Set in 1950s New York, this coming-of-age novel has become one of the most influential works in American literature.",
    image: "images/books/book-5.jpg",
    copies: 3,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    reviews: [
      { name: "Amandeep Singh", rating: 4, comment: "Relatable and raw. Holden's voice stays with you." },
      { name: "Kavita Sharma", rating: 5, comment: "A brilliant exploration of youth and identity. Must read!" }
    ]
  },

  /* ========================================
   * NON-FICTION (Books 6-10)
   * ======================================== */
  {
    id: 6,
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    price: 499,
    rating: 4.7,
    category: "Non-Fiction",
    description: "In this groundbreaking narrative, Yuval Noah Harari surveys the history of humankind from the Stone Age to the twenty-first century. Sapiens explores how biology and history have defined us and reveals what it means to be human.",
    image: "images/books/book-6.jpg",
    copies: 4,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    reviews: [
      { name: "Gurpreet Kaur", rating: 5, comment: "Mind-blowing perspective on human history. Changed my worldview." },
      { name: "Vikram Singh", rating: 5, comment: "Harari makes complex history accessible and fascinating." }
    ]
  },
  {
    id: 7,
    title: "Atomic Habits",
    author: "James Clear",
    price: 450,
    rating: 4.9,
    category: "Non-Fiction",
    description: "James Clear reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results. Learn how small changes can transform your life.",
    image: "images/books/book-7.jpg",
    copies: 7,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    reviews: [
      { name: "Harpreet Singh", rating: 5, comment: "Life-changing book! Simple yet powerful strategies for self-improvement." },
      { name: "Sonia Mahajan", rating: 5, comment: "The best self-improvement book I've ever read. Practical and actionable." },
      { name: "Amit Joshi", rating: 4, comment: "Great insights on building lasting habits. Highly recommend!" }
    ]
  },
  {
    id: 8,
    title: "Educated",
    author: "Tara Westover",
    price: 399,
    rating: 4.6,
    category: "Non-Fiction",
    description: "Tara Westover's memoir recounts her journey from growing up in a survivalist family in rural Idaho to earning a PhD from Cambridge University. A powerful testament to the transformative power of education.",
    image: "images/books/book-8.jpg",
    copies: 3,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    reviews: [
      { name: "Pooja Thakur", rating: 5, comment: "An incredible memoir. Inspiring and beautifully written." },
      { name: "Rajesh Kumar", rating: 4, comment: "A powerful story about the value of education." }
    ]
  },
  {
    id: 9,
    title: "Becoming",
    author: "Michelle Obama",
    price: 550,
    rating: 4.5,
    category: "Non-Fiction",
    description: "In her memoir, former First Lady Michelle Obama chronicles the experiences that have shaped her — from her childhood in Chicago to her years in the White House. An intimate, powerful, and inspiring account of an extraordinary life.",
    image: "images/books/book-9.jpg",
    copies: 2,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    reviews: [
      { name: "Divya Sharma", rating: 5, comment: "Empowering and heartfelt. Michelle Obama is a true inspiration." },
      { name: "Jaspal Kaur", rating: 4, comment: "Beautifully told story of resilience and determination." }
    ]
  },
  {
    id: 10,
    title: "The Diary of a Young Girl",
    author: "Anne Frank",
    price: 199,
    rating: 4.8,
    category: "Non-Fiction",
    description: "The definitive edition of the diary of Anne Frank, a young Jewish girl who documented her life while hiding from the Nazis during the occupation of the Netherlands. A deeply moving testament to the human spirit.",
    image: "images/books/book-10.jpg",
    copies: 5,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: false,
    reviews: [
      { name: "Meera Patel", rating: 5, comment: "Heart-wrenching and powerful. Every student should read this." },
      { name: "Sukhwinder Singh", rating: 5, comment: "Anne's spirit shines through every page. Unforgettable." }
    ]
  },

  /* ========================================
   * ACADEMIC (Books 11-15)
   * ======================================== */
  {
    id: 11,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    price: 899,
    rating: 4.6,
    category: "Academic",
    description: "Known as CLRS, this comprehensive textbook covers a broad range of algorithms in depth, making it an essential resource for computer science students. Features clear explanations, pseudocode, and rigorous mathematical analysis.",
    image: "images/books/book-11.jpg",
    copies: 8,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    reviews: [
      { name: "Karan Mehta", rating: 5, comment: "The bible of algorithms! Essential for every CS student at GNDEC." },
      { name: "Navjot Singh", rating: 4, comment: "Comprehensive and well-structured. Great reference book." }
    ]
  },
  {
    id: 12,
    title: "Physics: Principles with Applications",
    author: "Douglas C. Giancoli",
    price: 750,
    rating: 4.4,
    category: "Academic",
    description: "This bestselling textbook presents physics in a clear and relatable way, connecting physics principles to real-world applications. Ideal for engineering students who need a solid foundation in physics.",
    image: "images/books/book-12.jpg",
    copies: 6,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    reviews: [
      { name: "Rohit Sharma", rating: 4, comment: "Great textbook for understanding physics fundamentals." },
      { name: "Anjali Kaur", rating: 4, comment: "Well-explained concepts with practical examples." }
    ]
  },
  {
    id: 13,
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    price: 850,
    rating: 4.5,
    category: "Academic",
    description: "James Stewart's calculus textbook is widely renowned for its mathematical precision, accuracy, and clarity of exposition. This edition includes updated examples, exercises, and applications that reflect current trends in mathematics.",
    image: "images/books/book-13.jpg",
    copies: 5,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    reviews: [
      { name: "Tanveer Kaur", rating: 5, comment: "Best calculus textbook out there. Clear explanations and great exercises." },
      { name: "Mohit Kumar", rating: 4, comment: "Helped me ace my math courses at GNDEC!" }
    ]
  },
  {
    id: 14,
    title: "Operating System Concepts",
    author: "Abraham Silberschatz",
    price: 799,
    rating: 4.5,
    category: "Academic",
    description: "This definitive textbook provides a solid foundation in operating systems. Covering process management, memory management, storage management, and more, it's an essential resource for computer science and IT students.",
    image: "images/books/book-14.jpg",
    copies: 4,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    reviews: [
      { name: "Pankaj Gupta", rating: 5, comment: "The go-to textbook for OS. Well-organized and thorough." },
      { name: "Simranpreet Kaur", rating: 4, comment: "Excellent for understanding operating system concepts in depth." }
    ]
  },
  {
    id: 15,
    title: "Data Structures & Algorithms in Java",
    author: "Robert Lafore",
    price: 699,
    rating: 4.3,
    category: "Academic",
    description: "This hands-on guide makes data structures and algorithms accessible through intuitive explanations, clear illustrations, and practical Java implementations. Perfect for engineering students learning DSA.",
    image: "images/books/book-15.jpg",
    copies: 6,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    reviews: [
      { name: "Varun Dhawan", rating: 4, comment: "Great for beginners. Explains concepts with simple Java examples." },
      { name: "Isha Saini", rating: 4, comment: "Very helpful for placement preparation and coursework." }
    ]
  },

  /* ========================================
   * SELF-HELP (Books 16-20)
   * ======================================== */
  {
    id: 16,
    title: "The 7 Habits of Highly Effective People",
    author: "Stephen R. Covey",
    price: 399,
    rating: 4.6,
    category: "Self-Help",
    description: "Stephen Covey presents a holistic, principle-centered approach for solving personal and professional problems. With deep insights and practical anecdotes, Covey reveals a step-by-step pathway to living with fairness, integrity, and human dignity.",
    image: "images/books/book-16.jpg",
    copies: 5,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    reviews: [
      { name: "Jasmine Kaur", rating: 5, comment: "Transformative read! The habits are genuinely life-changing." },
      { name: "Manish Tiwari", rating: 4, comment: "Timeless wisdom for personal and professional growth." }
    ]
  },
  {
    id: 17,
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    price: 249,
    rating: 4.4,
    category: "Self-Help",
    description: "Napoleon Hill's classic work distills the secrets of success from interviews with over 500 of the most successful people in America. A motivational masterpiece that has inspired millions worldwide.",
    image: "images/books/book-17.jpg",
    copies: 4,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    reviews: [
      { name: "Suresh Patel", rating: 4, comment: "A classic that every ambitious person should read." },
      { name: "Nidhi Sharma", rating: 5, comment: "The 13 principles are powerful. Great motivational book!" }
    ]
  },
  {
    id: 18,
    title: "How to Win Friends & Influence People",
    author: "Dale Carnegie",
    price: 299,
    rating: 4.7,
    category: "Self-Help",
    description: "Dale Carnegie's timeless guide to interpersonal skills teaches fundamental techniques for handling people, winning friends, and changing people's attitudes. A must-read for anyone looking to improve their social skills.",
    image: "images/books/book-18.jpg",
    copies: 5,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    reviews: [
      { name: "Ritika Arora", rating: 5, comment: "Changed how I interact with people. Simple yet profound advice." },
      { name: "Gurinder Singh", rating: 4, comment: "Practical tips that actually work in daily life." }
    ]
  },
  {
    id: 19,
    title: "The Power of Now",
    author: "Eckhart Tolle",
    price: 350,
    rating: 4.5,
    category: "Self-Help",
    description: "Eckhart Tolle's guide to spiritual enlightenment shows readers how to quiet their minds, live in the present moment, and find true peace and fulfillment. A transformative journey into consciousness and awareness.",
    image: "images/books/book-19.jpg",
    copies: 3,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    reviews: [
      { name: "Aarti Mehta", rating: 5, comment: "A life-changing book about mindfulness and presence." },
      { name: "Darshan Singh", rating: 4, comment: "Powerful spiritual guide. Helps you find inner peace." }
    ]
  },
  {
    id: 20,
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    price: 399,
    rating: 4.6,
    category: "Self-Help",
    description: "Robert Kiyosaki shares the financial lessons he learned from his two 'dads' — his real father and the father of his best friend. This book challenges conventional thinking about money, work, and financial independence.",
    image: "images/books/book-20.jpg",
    copies: 6,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: true,
    reviews: [
      { name: "Kunal Jain", rating: 5, comment: "Eye-opening book about financial literacy. Every student should read it!" },
      { name: "Preetika Kaur", rating: 4, comment: "Great introduction to financial thinking. Very motivating." }
    ]
  },

  /* ========================================
   * CHILDREN'S (Books 21-24)
   * ======================================== */
  {
    id: 21,
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    price: 450,
    rating: 4.9,
    category: "Children's",
    description: "The first book in J.K. Rowling's legendary series introduces Harry Potter, an orphan boy who discovers he's a wizard on his eleventh birthday. Follow Harry as he enters Hogwarts School of Witchcraft and Wizardry and uncovers his magical destiny.",
    image: "images/books/book-21.jpg",
    copies: 8,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    reviews: [
      { name: "Aditya Sharma", rating: 5, comment: "Pure magic! The book that started it all. A masterpiece." },
      { name: "Riya Kaur", rating: 5, comment: "No matter your age, Harry Potter never fails to enchant." },
      { name: "Vikrant Bedi", rating: 5, comment: "The world-building is phenomenal. J.K. Rowling is brilliant!" }
    ]
  },
  {
    id: 22,
    title: "Charlotte's Web",
    author: "E.B. White",
    price: 199,
    rating: 4.4,
    category: "Children's",
    description: "The beloved tale of friendship between Wilbur the pig and Charlotte the spider. E.B. White's classic story about loyalty, love, and the beauty of life has charmed readers for generations.",
    image: "images/books/book-22.jpg",
    copies: 4,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    reviews: [
      { name: "Meenakshi Devi", rating: 5, comment: "A beautiful story about friendship and kindness." },
      { name: "Sahil Verma", rating: 4, comment: "Heartwarming tale that teaches important life lessons." }
    ]
  },
  {
    id: 23,
    title: "The Lion, the Witch and the Wardrobe",
    author: "C.S. Lewis",
    price: 350,
    rating: 4.6,
    category: "Children's",
    description: "Four children step through a wardrobe into the magical land of Narnia, where they must help the great lion Aslan defeat the White Witch and restore peace. A timeless fantasy adventure of courage, sacrifice, and hope.",
    image: "images/books/book-23.jpg",
    copies: 3,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    reviews: [
      { name: "Taranjit Kaur", rating: 5, comment: "A magical adventure that captures the imagination!" },
      { name: "Deepanshu Garg", rating: 4, comment: "Narnia is a world you'll never want to leave." }
    ]
  },
  {
    id: 24,
    title: "Matilda",
    author: "Roald Dahl",
    price: 225,
    rating: 4.5,
    category: "Children's",
    description: "Matilda is a genius child who loves reading and learning, but is neglected by her parents. When she discovers she has telekinetic powers, she uses them to stand up against the terrifying headmistress, Miss Trunchbull. A delightful story of courage and cleverness.",
    image: "images/books/book-24.jpg",
    copies: 5,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    reviews: [
      { name: "Palak Gupta", rating: 5, comment: "Roald Dahl at his finest! Matilda is an unforgettable character." },
      { name: "Abhishek Kaur", rating: 4, comment: "Funny, heartwarming, and inspiring. Loved every page!" }
    ]
  }
];
