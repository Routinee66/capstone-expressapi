// const { Firestore } = require('@google-cloud/firestore');
const { admin, firestore } = require('../../config/firebaseConfig')
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');
const ClientError = require('../../exceptions/ClientError');
const ArticlesService = require('./ArticlesService');
const BatikService = require('./BatikService');

const articlesService = new ArticlesService();
const batikService = new BatikService();


class BookmarksServices {
  constructor() {
    this.collection = 'bookmarks';
    this.firestore = firestore;
    this.collectionRef = this.firestore.collection(this.collection);
  }

  async getBookmarkByUsername(username) {
    const querySnapshot = await this.collectionRef.doc(username).get();
    const bookmarks = {};

    if (querySnapshot.empty) {
      throw new NotFoundError('Bookmark Tidak Ditemukan');
    }

    const result = querySnapshot.data();
    const contentTypes = Object.keys(result);

    const promises = contentTypes.map(async (contentType) => {
      const contents = result[contentType];
      bookmarks[contentType] = [];

      await Promise.all(contents.map(async (content) => {
        if (contentType === 'artikel') {
          const article = await articlesService.getArticleById(content.contentId);
          bookmarks[contentType].push(article);
        } else if (contentType === 'batik') {
          const batik = await batikService.getBatikById(content.contentId);
          bookmarks[contentType].push(batik);
        }
      }));
    });

    await Promise.all(promises);
    return bookmarks;
  }

  async getBookmarkArticlesByUsername(username) {
    const querySnapshot = await this.collectionRef.doc(username).get();
    const result = querySnapshot.data();

    if (querySnapshot.empty) {
      throw new NotFoundError('Bookmark Tidak Ditemukan');
    }

    const promises = await Promise.all(result['article'].map(async (content) => {
      const article = await articlesService.getArticleById(content.contentId);
      return article;
    }));

    return promises;
  }

  async getBookmarkBatikByUsername(username) {
    const querySnapshot = await this.collectionRef.doc(username).get();
    const result = querySnapshot.data();

    if (querySnapshot.empty) {
      throw new NotFoundError('Bookmark Tidak Ditemukan');
    }

    const promises = await Promise.all(result['batik'].map(async (content) => {
      const batik = await batikService.getBatikById(content.contentId);
      return batik;
    }));

    return promises;
  }

  async postBookmark(username, contentId) {
    try {
      const contentType = contentId.split('-')[0];
      const bookmark = { contentId: contentId };
      const documentRef = this.collectionRef.doc(username);

      const docSnapshot = await documentRef.get();

      if (docSnapshot.exists) {
        await documentRef.update({
          [contentType]: admin.firestore.FieldValue.arrayUnion(bookmark),
        });
      } else {
        await documentRef.set({
          [contentType]: [bookmark],
        });
      }

      return;
    } catch (error) {
      throw new ClientError('Gagal menambahkan bookmark');
    }
  }

  async deleteBookmarkById(username, contentId) {
    const contentType = contentId.split('-')[0];
    const valueToRemove = { 'contentId': contentId };
    let collection;
    if (contentType === 'article') {
      collection = 'articles';
    } else if (contentType === 'batik') {
      collection = contentType;
    } else {
      throw new NotFoundError('Konten Tidak Ditemukan');
    }
    const querySnapshot = await firestore.collection(collection).doc(contentId).get();
    if (querySnapshot.empty) {
      throw new NotFoundError('Artikel Tidak Ditemukan');
    }

    await this.collectionRef.doc(username).update({
      [contentType]: admin.firestore.FieldValue.arrayRemove(valueToRemove),
    });

    return "Bookmark berhasil dihapus";
  }
}

module.exports = BookmarksServices;