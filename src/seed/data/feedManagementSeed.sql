--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;

CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) DEFAULT NULL,
  `text` varchar(45) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `replies` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;

UNLOCK TABLES;

--
-- Table structure for table `counters`
--

DROP TABLE IF EXISTS `counters`;

CREATE TABLE `counters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `comment_id` int(11) DEFAULT NULL,
  `post_id` int(11) DEFAULT NULL,
  `like` int(11) DEFAULT 0,
  `haha` int(11) DEFAULT 0,
  `love` int(11) DEFAULT 0,
  `sad` int(11) DEFAULT 0,
  `angry` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `counters`
--

LOCK TABLES `counters` WRITE;

UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;

CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` longtext DEFAULT NULL,
  `images` longtext DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
INSERT INTO `posts` VALUES
(38,'hi','[\"1705772103153-1ded508d-8d3b-40ca-8c7e-a34cc34762df.jpg\"]','2024-01-20 17:35:03','2024-01-20 17:35:03',42),
(39,'rtrty','[\"1705772247698-2corder.png\",\"1705772247700-howReact1.png\"]','2024-01-20 17:37:27','2024-01-20 17:37:27',42),
(40,'','[\"1705772416731-howReact1.png\",\"1705772416746-mypic.jpeg\"]','2024-01-20 17:40:16','2024-01-20 17:40:16',42);
UNLOCK TABLES;

--
-- Table structure for table `replies`
--

DROP TABLE IF EXISTS `replies`;

CREATE TABLE `replies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `comment_id` int(11) DEFAULT NULL,
  `text` varchar(45) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Dumping data for table `replies`
--

LOCK TABLES `replies` WRITE;

UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `username` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password` longtext DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `passwordResetExpires` datetime DEFAULT NULL,
  `passwordResetToken` varchar(200) DEFAULT NULL,
  `role` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
INSERT INTO `users` VALUES
(9,'sajjad','sajjad960','sajjad@gmail.com','$2b$12$VDB1X1wpy.y6hDAkwSZVk.x90Jj4l3YimQja6X2ItrtN3sQedfC3i','2023-12-01 15:29:00','2023-12-01 15:29:00',NULL,NULL,NULL),
(10,NULL,NULL,NULL,NULL,'2023-12-01 16:28:47','2023-12-01 16:28:47',NULL,NULL,NULL),
(11,NULL,NULL,NULL,NULL,'2023-12-01 16:29:54','2023-12-01 16:29:54',NULL,NULL,NULL),
(12,NULL,NULL,NULL,NULL,'2023-12-01 16:30:23','2023-12-01 16:30:23',NULL,NULL,NULL),
(13,NULL,NULL,NULL,NULL,'2023-12-01 16:30:53','2023-12-01 16:30:53',NULL,NULL,NULL),
(14,NULL,NULL,NULL,NULL,'2023-12-01 16:31:11','2023-12-01 16:31:11',NULL,NULL,NULL),
(15,NULL,NULL,NULL,NULL,'2023-12-01 16:33:42','2023-12-01 16:33:42',NULL,NULL,NULL),
(16,NULL,NULL,NULL,NULL,'2023-12-01 16:34:04','2023-12-01 16:34:04',NULL,NULL,NULL),
(17,NULL,NULL,NULL,NULL,'2023-12-01 16:34:34','2023-12-01 16:34:34',NULL,NULL,NULL),
(23,NULL,NULL,NULL,NULL,'2023-12-23 06:44:47','2023-12-23 06:44:47',NULL,NULL,NULL),
(25,'sajjad',NULL,'sajjad2@gmail.com','$2b$12$ODtBq7is5r0wBzjdyzjYg.gB5SoB6xIgIqm0m0X4AvtaxWDnbf2rK','2024-01-05 15:35:15','2024-01-05 15:35:15',NULL,NULL,NULL),
(26,'sajjad',NULL,'sajjad5@gmail.com','$2b$12$KZ7REqsWmntUMizWpWtVFO7C7dU6bhqcUrcbwsoy1eyV0lMX5or4e','2024-01-05 15:38:07','2024-01-05 15:38:07',NULL,NULL,NULL),
(28,'sajjad',NULL,'sajjad8@gmail.com','$2b$12$PjobRuiPK1lv1NL7DmZK0u9RtQa1i4Bw.giby3QzTcJDin8kMaFoa','2024-01-05 15:38:46','2024-01-05 15:38:46',NULL,NULL,NULL),
(30,'sajjad',NULL,'sajjad9@gmail.com','$2b$12$H7BkY09jQlA0l.MF9kXzlOn.EkUlJTsB.eKck0NzRsFzpF4pGa.Kq','2024-01-05 15:40:37','2024-01-05 15:40:37',NULL,NULL,NULL),
(31,'sajjad',NULL,'sajjad6@gmail.com','$2b$12$js9IlEDQ/at9TBmry9gg1u0i0BuoPTvat.Wfvht68372CMW0Nbdo2','2024-01-05 15:43:29','2024-01-05 15:43:29',NULL,NULL,NULL),
(33,'sajjad',NULL,'sajja4d@gmail.com','$2b$12$1EVeNLs3TVdBPnwJd3hxzOVOhW7JafTej9r0pjUSp7e7.ewvqO9sS','2024-01-09 05:44:55','2024-01-09 05:44:55',NULL,NULL,NULL),
(34,'Shoriful Islam',NULL,'heybrosajjad@gmail.com','$2b$12$sCENDHpiWsLOP0OdkcbZHu5oyVotAJyNm7Mhszzn3MjrE1Nm1wwbW','2024-01-09 08:52:27','2024-01-09 08:52:27',NULL,NULL,NULL),
(35,'Shoriful Islam',NULL,'heybrosajja55d@gmail.com','$2b$12$XJhRtacJNQShLNA6tjH23.4AF7WOX07QkOVfd24Z/3tEEYn0fvUam','2024-01-09 09:01:18','2024-01-09 09:01:18',NULL,NULL,NULL),
(37,'Shoriful Islam',NULL,'heybrosajja55d44@gmail.com','$2b$12$I.9EDvTVuF/Fn1u9wG3pu.5JrLwhFtXjr.Y0mET9Gbg70HDIhgSi2','2024-01-09 09:03:52','2024-01-09 09:03:52',NULL,NULL,NULL),
(39,'Shoriful Islam',NULL,'heybrosajja55d5544@gmail.com','$2b$12$xBJUVRIq9ffTt6ZlyOul4eHbNEY6DDKI7V8E315ZqHhYKsvRkodmO','2024-01-09 09:06:55','2024-01-09 09:06:55',NULL,NULL,NULL),
(40,'Shoriful Islam',NULL,'heybrosajja555d5544@gmail.com','$2b$12$1HaEX.GpmuddP6nEX4npo.KluDGE1A4XCCcsQ/c7XZZPDdMLBk.5O','2024-01-09 09:07:24','2024-01-09 09:07:24',NULL,NULL,NULL),
(42,'sajjad',NULL,'sajja4sd@gmail.com','$2b$12$xBcDQe3h8INg6m57CpsmdOed.ZFpv1mYRFSPzRH8AhONdL06CTwOu','2024-01-09 17:35:47','2024-01-09 17:35:47',NULL,NULL,NULL),
(43,'Shoriful Islam',NULL,'heybrosajjaddddddd@gmail.com','$2b$12$YL/7Qe6bvW2xUheABCJ8GuDWs9wNnmcZ9AFHvEpd/jyAnRYV6rhOi','2024-01-09 17:36:45','2024-01-09 17:36:45',NULL,NULL,NULL),
(44,'Shoriful Islam',NULL,'heybrosajjadeerte@gmail.com','$2b$12$WLsh0nekPrJhuye4kqo3c.Cz7C4A1IEKdQAtrzDQZURSBSHsJdhU6','2024-01-09 17:49:44','2024-01-09 17:49:44',NULL,NULL,NULL),
(47,'sajjad','sajjad960','sajjadsdfdsf@gmail.com','$2b$12$TAXlZTBcanY9GSkiS6ZuoeEiNKi3CvQyjKUPW1N0VMKHxPAcGhHJi','2024-01-10 16:27:05','2024-01-10 16:27:05',NULL,NULL,'user'),
(48,'Shoriful Islam',NULL,'sorif@gmail.com','$2b$12$8VpwGModRf7zDs0nC456V.Z/fZRFTP58LZldentFzmn7GbSVUIUam','2024-01-10 16:41:06','2024-01-10 16:41:06',NULL,NULL,'user');
UNLOCK TABLES;
