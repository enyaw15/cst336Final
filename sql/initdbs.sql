SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
SET @@auto_increment_increment=1;
START TRANSACTION;
SET time_zone = "+00:00";

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `userId` int NOT NULL,
    `username` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
    `password` varchar(72) COLLATE utf8_unicode_ci NOT NULL,
    `isAdmin` bool DEFAULT false
    ) ENGINE = InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `users`(`username`,`password`,`isAdmin`) VALUES
('admin','$2b$15$IazZIAMbXaEzEQy1.PkXDOHGy4IVj6HV.tuyXNvEusm2xmYS.3goK', true);

DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags` (
`tagname` varchar(25) COLLATE utf8_unicode_ci NOT NULL PRIMARY KEY
)ENGINE = InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `tags` (`tagname`) VALUES
('fun'),
('simple'),
('complex'),
('short'),
('long'),
('easy'),
('difficult'),
('crazy'),
('expensive'),
('cheap'),
('funny'),
('single player'),
('multi player'),
('big group'),
('small group'),
('family friendly'),
('indoors'),
('outdoors'),
('nature'),
('scary'),
('historical'),
('informational');

DROP TABLE IF EXISTS `blog_posts`;
CREATE TABLE `blog_posts` (
    `blogId` int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `title` varchar(64) NOT NULL COLLATE utf8_unicode_ci,
    `author_username` varchar(25) NOT NULL COLLATE utf8_unicode_ci  DEFAULT 'admin',
    `body` text NOT NULL
)ENGINE = InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `blog_posts` (`title`,`body`) VALUES
("Locked in", "Well i guess we all have to stay inside now!"),
("Locked out", "I locked the keys inside! :("),
("Clever guy", "); DROP TABLES"),
("A Question", "Why did the chicken cross the road?"),
("An answer", "To get to the otherside!"),
("What did anonymous say?", "What did anonymous say!"),
("Police police", "Police police police police!"),
("Trees", "Trees are mostly made of air"),
("The dangers dihydrogen monoxide",  "inhilation of to much dihydrogen monoxide can be dangerous make sure to avoid it!"),
("What is dihydrogen monoxide", "dihydrogen monoxide is water. DO NOT INHALE"),
("Police police 2", "Police police police police police police!"),
("lorem ipsum", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi dui nunc, rhoncus eget molestie et, faucibus vitae nisi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean eu ipsum ipsum. Curabitur feugiat ligula rhoncus diam fermentum dignissim. Nullam posuere enim vitae accumsan viverra. Duis molestie gravida massa a aliquam. Vestibulum et nisi magna. Maecenas felis diam, iaculis eget sagittis in, ultricies nec lectus. Vestibulum ut facilisis sapien. Vestibulum nec ligula nec orci sodales vehicula. Nulla facilisi. Curabitur in sem id metus consequat dignissim non nec tellus. Cras hendrerit sapien dolor, in lacinia ligula hendrerit id. Donec enim elit, porta at aliquet bibendum, commodo vitae mi. Phasellus nec tempus arcu, quis venenatis ipsum. Curabitur maximus ut eros nec pulvinar. In vitae turpis a orci ultricies vestibulum. Mauris lacinia malesuada nulla vitae consectetur. Curabitur ac malesuada lorem, a elementum mi. Vivamus finibus ex dolor, vitae vulputate lacus placerat vel. Duis in consectetur eros. Pellentesque cursus enim at orci consectetur, et lacinia lectus gravida. In ac nisi eget lacus mattis dignissim. In ut urna a orci sagittis mattis. Vestibulum ac finibus augue. Etiam malesuada porta placerat. Nam eu nisi vitae nisi porttitor scelerisque. Suspendisse pulvinar interdum risus, sed iaculis justo tempus vel. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam ex est, faucibus ut pretium id, fringilla accumsan tellus. Duis sed urna semper erat accumsan consequat. Duis bibendum viverra eros sed congue. Phasellus sed leo quis nunc imperdiet mattis sed et nisl. Vivamus pharetra dui non dictum pretium. Cras dignissim, felis in ultrices consectetur, erat arcu viverra ligula, ut fringilla dui ex eget ex. Curabitur porttitor ligula non enim maximus, id tincidunt nisl molestie. Ut ultrices iaculis faucibus. Praesent hendrerit ante non justo accumsan rhoncus quis at enim. Pellentesque mattis metus at neque aliquet id."),
("what is lorem ipsum", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."),
("posting with a poster", "the poster says post!"),
("you enter the dungeon", "a groo kills you!"),
("Test post please ignore", "you were supposed to ignore this!"),
("This website sucks", "I am leaving!"),
("This website is great", "I am staying!"),
("Who is admin?", "I am admin"),
("Wild animal on the site", "its a moose named anony");

DROP TABLE IF EXISTS `tag_to_blog`;
CREATE TABLE `tag_to_blog`(
    `tagname` varchar(25) NOT NULL COLLATE utf8_unicode_ci,
    `blogID` mediumint(64) NOT NULL
);

INSERT INTO `tag_to_blog` (`tagname`,`blogID`) VALUES
    ("simple", 1),
    ("short", 1),
    ("indoors", 1),
    ("simple", 2),
    ("short", 2),
    ("outdoors", 2),
    ("complex",3),
    ("funny",4),
    ("nature",4),
    ("funny",5),
    ("nature",5),
    ("funny",6),
    ("complex",6),
    ("complex",7),
    ("informational",8),
    ("informational",9),
    ("scary",9),
    ("simple",10),
    ("informational",10),
    ("complex",11),
    ("long",12),
    ("long",13),
    ("informational",13),
    ("fun",14),
    ("fun",15),
    ("difficult",15),
    ("funny",16),
    ("short",17),
    ("short",18),
    ("informational",19),
    ("funny",19),
    ("funny",20),
    ("informational",20);

DROP TABLE IF EXISTS `saved_posts`;
CREATE TABLE `saved_posts`(
    `userId` varchar(25) NOT NULL COLLATE utf8_unicode_ci,
    `blogID` mediumint(64) NOT NULL
);

INSERT INTO `saved_posts` VALUES
('admin',1),
('admin',2),
('admin',3),
('admin',4),
('admin',5),
('admin',6),
('admin',7),
('admin',8),
('admin',9),
('admin',10),
('admin',11),
('admin',12),
('admin',13),
('admin',14),
('admin',15),
('admin',16),
('admin',17),
('admin',18),
('admin',19),
('admin',20);

ALTER TABLE `users` ADD PRIMARY KEY (`userId`);
    
ALTER TABLE `users` MODIFY `userId` tinyint(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
COMMIT;