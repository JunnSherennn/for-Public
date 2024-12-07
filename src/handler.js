const books = require('./books');

const addBookHandler = (request, h) => {

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }

  const { nanoid } = require('nanoid');

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  };
  books.push(newBook);


  const isSuccess = books.some((book) => book.id === id);

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    });
    response.code(201);
    return response;
  }
};

const getAllBooksHandler = (request, h) => {

  const getINP = books.map(({ id, name, publisher }) => ({ id, name, publisher }));

  const { name, reading, finished } = request.query;

  const searchTerm = name?.toLowerCase().replace(/\s+/g, '');


  if (name) {
    const response = h.response({
      status: 'success',
      data: {
        books: books.filter(x => x.name.toLowerCase().replace(/\s+/g, '').includes(searchTerm)).map(({ id, name, publisher }) => ({ id, name, publisher }))
      }
    });
    response.code(200);
    return response;
  }

  if (parseInt(reading, 10) === 0 || parseInt(reading, 10) === 1) {

    const changeIntToBool = () => {
      return parseInt(reading, 10) === 1 ? true : false;
    };

    const response = h.response({
      status: 'success',
      data: {
        books: books.filter((x) => x.reading === changeIntToBool()).map(({ id, name, publisher }) => ({ id, name, publisher }))
      }
    });
    response.code(200);
    return response;
  }

  if (parseInt(finished, 10) === 0 || parseInt(finished, 10) === 1) {

    const changeIntToBool = () => {
      return parseInt(finished, 10) === 1 ? true : false;
    };

    const response = h.response({
      status: 'success',
      data: {
        books: books.filter((x) => x.finished === changeIntToBool()).map(({ id, name, publisher }) => ({ id, name, publisher }))
      }
    });
    response.code(200);
    return response;
  }

  return {
    status: 'success',
    data: {
      books: getINP
    }
  };
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const bookFiltered = books.filter((x) => x.id === bookId)[0];

  if (bookFiltered !== undefined) {
    return {
      status: 'success',
      data: {
        book: bookFiltered
      }
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }

  const updatedAt = new Date().toISOString();

  const indexBook = books.findIndex((x) => x.id === bookId);

  if (indexBook !== -1) {
    books[indexBook] = {
      ...books[indexBook],
      name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {

  const { bookId } = request.params;

  const indexBook = books.findIndex((x) => x.id === bookId);

  if (indexBook !== -1) {
    books.splice(indexBook, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  });
  response.code(404);
  return response;
};


module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };