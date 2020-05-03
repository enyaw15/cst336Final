SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `userId` tinyint(2) NOT NULL,
    `username` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
    `password` varchar(72) COLLATE utf8_unicode_ci NOT NULL,
    `isAdmin` bool DEFAULT false
    ) ENGINE = InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags` (
`tagname` varchar(25) COLLATE utf8_unicode_ci NOT NULL PRIMARY KEY
);

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
('historical');

ALTER TABLE `users` ADD PRIMARY KEY (`userId`);
    
ALTER TABLE `users` MODIFY `userId` tinyint(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
COMMIT;