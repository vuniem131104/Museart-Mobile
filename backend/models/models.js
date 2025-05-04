const { DataTypes } = require("sequelize");
const sequelize = require("./config.models");

// Định nghĩa các model
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "user",
    timestamps: false,
  }
);

const Author = sequelize.define(
  "Author",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
    dob: {
      type: DataTypes.DATEONLY,
    },
  },
  {
    tableName: "author",
    timestamps: false,
  }
);

const Artwork = sequelize.define(
  "Artwork",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    image_url: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.DATEONLY,
    },
    date_display: {
      type: DataTypes.DATEONLY,
    },
    place_of_origin: {
      type: DataTypes.STRING,
    },
    fiscal_year: {
      type: DataTypes.INTEGER,
    },
    dimensions: {
      type: DataTypes.STRING,
    },
    credit_line: {
      type: DataTypes.STRING,
    },
    inscription: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
    artist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "artwork",
    timestamps: false,
  }
);

const ArtworkReaction = sequelize.define(
  "ArtworkReaction",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    artwork_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "artwork_reaction",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "artwork_id"],
      },
    ],
  }
);

const ArtworkComment = sequelize.define(
  "ArtworkComment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    artwork_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "artwork_comment",
    timestamps: false,
  }
);

const Exhibition = sequelize.define(
  "Exhibition",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    image_url: {
      type: DataTypes.STRING,
    },
    start_time: {
      type: DataTypes.DATE,
    },
    end_time: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "exhibition",
    timestamps: false,
  }
);

const ExhibitionReaction = sequelize.define(
  "ExhibitionReaction",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    exhibition_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "exhibition_reaction",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "exhibition_id"],
      },
    ],
  }
);

const ExhibitionComment = sequelize.define(
  "ExhibitionComment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    exhibition_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "exhibition_comment",
    timestamps: false,
  }
);

const ExhibitionArtwork = sequelize.define(
  "ExhibitionArtwork",
  {
    exhibition_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    artwork_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    tableName: "exhibition_artwork",
    timestamps: false,
  }
);

const Article = sequelize.define(
  "Article",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.TEXT,
    },
    classification: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "article",
    timestamps: false,
  }
);

const Tag = sequelize.define(
  "Tag",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    tableName: "tag",
    timestamps: false,
  }
);

const ArtworkTag = sequelize.define(
  "ArtworkTag",
  {
    artwork_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    tag_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    tableName: "artwork_tag",
    timestamps: false,
  }
);

const ExhibitionTag = sequelize.define(
  "ExhibitionTag",
  {
    exhibition_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    tag_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    tableName: "exhibition_tag",
    timestamps: false,
  }
);

const ArticleTag = sequelize.define(
  "ArticleTag",
  {
    article_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    tag_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    tableName: "article_tag",
    timestamps: false,
  }
);

const Bookmark = sequelize.define(
  "Bookmark",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    target_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    target_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "bookmark",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "target_type", "target_id"],
      },
    ],
  }
);

const StoreItem = sequelize.define(
  "StoreItem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    classification: {
      type: DataTypes.STRING,
    },
    image_url: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "store_item",
    timestamps: false,
  }
);

const CartItem = sequelize.define(
  "CartItem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    added_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "cart_item",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "item_id"],
      },
    ],
  }
);

// Thiết lập các mối quan hệ

// Artwork - Author
Artwork.belongsTo(Author, {
  foreignKey: "artist_id",
  as: "artist",
});
Author.hasMany(Artwork, {
  foreignKey: "artist_id",
  as: "artworks",
});

// Article - Author
Article.belongsTo(Author, {
  foreignKey: "author_id",
  as: "author",
});
Author.hasMany(Article, {
  foreignKey: "author_id",
  as: "articles",
});

// ArtworkReaction - User, Artwork
ArtworkReaction.belongsTo(User, {
  foreignKey: "user_id",
});
User.hasMany(ArtworkReaction, {
  foreignKey: "user_id",
  as: "artworkReactions",
});
ArtworkReaction.belongsTo(Artwork, {
  foreignKey: "artwork_id",
});
Artwork.hasMany(ArtworkReaction, {
  foreignKey: "artwork_id",
  as: "reactions",
});

// ArtworkComment - User, Artwork
ArtworkComment.belongsTo(User, {
  foreignKey: "user_id",
});
User.hasMany(ArtworkComment, {
  foreignKey: "user_id",
  as: "artworkComments",
});
ArtworkComment.belongsTo(Artwork, {
  foreignKey: "artwork_id",
});
Artwork.hasMany(ArtworkComment, {
  foreignKey: "artwork_id",
  as: "comments",
});

// ExhibitionReaction - User, Exhibition
ExhibitionReaction.belongsTo(User, {
  foreignKey: "user_id",
});
User.hasMany(ExhibitionReaction, {
  foreignKey: "user_id",
  as: "exhibitionReactions",
});
ExhibitionReaction.belongsTo(Exhibition, {
  foreignKey: "exhibition_id",
});
Exhibition.hasMany(ExhibitionReaction, {
  foreignKey: "exhibition_id",
  as: "reactions",
});

// ExhibitionComment - User, Exhibition
ExhibitionComment.belongsTo(User, {
  foreignKey: "user_id",
});
User.hasMany(ExhibitionComment, {
  foreignKey: "user_id",
  as: "exhibitionComments",
});
ExhibitionComment.belongsTo(Exhibition, {
  foreignKey: "exhibition_id",
});
Exhibition.hasMany(ExhibitionComment, {
  foreignKey: "exhibition_id",
  as: "comments",
});

// Exhibition - Artwork (many-to-many)
Exhibition.belongsToMany(Artwork, {
  through: ExhibitionArtwork,
  foreignKey: "exhibition_id",
  otherKey: "artwork_id",
  as: "artworks",
});
Artwork.belongsToMany(Exhibition, {
  through: ExhibitionArtwork,
  foreignKey: "artwork_id",
  otherKey: "exhibition_id",
  as: "exhibitions",
});

// Artwork - Tag (many-to-many)
Artwork.belongsToMany(Tag, {
  through: ArtworkTag,
  foreignKey: "artwork_id",
  otherKey: "tag_id",
  as: "tags",
});
Tag.belongsToMany(Artwork, {
  through: ArtworkTag,
  foreignKey: "tag_id",
  otherKey: "artwork_id",
  as: "artworks",
});

// Exhibition - Tag (many-to-many)
Exhibition.belongsToMany(Tag, {
  through: ExhibitionTag,
  foreignKey: "exhibition_id",
  otherKey: "tag_id",
  as: "tags",
});
Tag.belongsToMany(Exhibition, {
  through: ExhibitionTag,
  foreignKey: "tag_id",
  otherKey: "exhibition_id",
  as: "exhibitions",
});

// Article - Tag (many-to-many)
Article.belongsToMany(Tag, {
  through: ArticleTag,
  foreignKey: "article_id",
  otherKey: "tag_id",
  as: "tags",
});
Tag.belongsToMany(Article, {
  through: ArticleTag,
  foreignKey: "tag_id",
  otherKey: "article_id",
  as: "articles",
});

// Bookmark - User
Bookmark.belongsTo(User, {
  foreignKey: "user_id",
});
User.hasMany(Bookmark, {
  foreignKey: "user_id",
  as: "bookmarks",
});

// CartItem - User, StoreItem
CartItem.belongsTo(User, {
  foreignKey: "user_id",
});
User.hasMany(CartItem, {
  foreignKey: "user_id",
  as: "cartItems",
});
CartItem.belongsTo(StoreItem, {
  foreignKey: "item_id",
  as: "item",
});
StoreItem.hasMany(CartItem, {
  foreignKey: "item_id",
  as: "inCarts",
});

module.exports = {
  sequelize,
  User,
  Author,
  Artwork,
  ArtworkReaction,
  ArtworkComment,
  Exhibition,
  ExhibitionReaction,
  ExhibitionComment,
  ExhibitionArtwork,
  Article,
  Tag,
  ArtworkTag,
  ExhibitionTag,
  ArticleTag,
  Bookmark,
  StoreItem,
  CartItem,
};
