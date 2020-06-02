<?php
/*
    ********************************************************************************************
    CONFIGURATION
    ********************************************************************************************
*/
// email envoyeur
$sender = 'rsvp@camilleetflorent.fr';
// Email de copie (camille et florent)
$email = 'mariage.camille.florent@gmail.com';
 
// copie ? (envoie une copie au visiteur)
$copie = 'oui'; // 'oui' ou 'non'
 
// Messages de confirmation du mail
$message_envoye = "Votre message nous est bien parvenu !";
$message_non_envoye = "L'envoi du mail a échoué, veuillez réessayer SVP.";
 
// Messages d'erreur du formulaire
$message_erreur_formulaire = "Vous devez d'abord <a href=\"form.php\">envoyer le formulaire</a>.";
$message_formulaire_invalide = "Vérifiez que tous les champs soient bien remplis et que l'email soit sans erreur.";
 
/*
    ********************************************************************************************
    FIN DE LA CONFIGURATION
    ********************************************************************************************
*/
 
// on teste si le formulaire a été soumis
if (!isset($_POST['envoi']))
{
    // formulaire non envoyé
    echo '<p>'.$message_erreur_formulaire.'</p>'."\n";
}
else
{
    /*
     * cette fonction sert à nettoyer et enregistrer un texte
     */
    function Rec($text)
    {
        $text = htmlspecialchars(trim($text), ENT_QUOTES);
        if (1 === get_magic_quotes_gpc())
        {
            $text = stripslashes($text);
        }
 
        $text = nl2br($text);
        return $text;
    };
 
    /*
     * Cette fonction sert à vérifier la syntaxe d'un email
     */
    function IsEmail($email)
    {
        $value = preg_match('/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9_](?:[a-zA-Z0-9_\-](?!\.)){0,61}[a-zA-Z0-9_-]?\.)+[a-zA-Z0-9_](?:[a-zA-Z0-9_\-](?!$)){0,61}[a-zA-Z0-9_]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/', $email);
        return (($value === 0) || ($value === false)) ? false : true;
    }
 
    // formulaire envoyé, on récupère tous les champs.	
	$participation 	= (isset($_POST['participation'])) 	? Rec($_POST['participation']) 	: '';
	$firstNames		= (isset($_POST['firstNames'])) 	? Rec($_POST['firstNames']) 	: '';
    $destinataire   = (isset($_POST['email'])) 			? Rec($_POST['email']) 			: '';
    $comments 		= (isset($_POST['comments'])) 		? Rec($_POST['comments']) 		: '';
    
    // $destinataire = 'test-lufnibw8e@srv1.mail-tester.com';
 
    // On va vérifier les variables et l'email ...
    $destinataire = (IsEmail($destinataire)) ? $destinataire : ''; // soit l'email est vide si erroné, soit il vaut l'email entré
 
    if (($participation != '') && ($firstNames != '') && ($destinataire != ''))
    {
        // les 4 variables sont remplies, on génère puis envoie le mail
        $headers  = 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'From: CamilleEtFlorent <'.$sender.'>' . "\r\n" .
            'Reply-To:'.$sender. "\r\n" .
            'Content-Type: text/plain; charset="utf-8"; DelSp="Yes"; format=flowed '."\r\n" .
            'Content-Disposition: inline'. "\r\n" .
            'Content-Transfer-Encoding: 7bit'." \r\n" .
            'X-Mailer:PHP/'.phpversion()."\r\n".
            'List-Unsubscribe: <mailto: ..?subject=unsubscribe>'."\r\n";
 
        // envoyer une copie à cam et flo
        $headers .= 'Cc:'.$email."\r\n";
        echo $headers;
 
        // Remplacement de certains caractères spéciaux
        $comments = str_replace("&#039;","'",$comments);
        $comments = str_replace("&#8217;","'",$comments);
        $comments = str_replace("&quot;",'"',$comments);
        $comments = str_replace('<br>','',$comments);
        $comments = str_replace('<br />','',$comments);
        $comments = str_replace("&lt;","<",$comments);
        $comments = str_replace("&gt;",">",$comments);
        $comments = str_replace("&amp;","&",$comments);
        
        $participationLine = 'oui';
        if ($participation == 'false') {
            $participationLine = 'non';
        } 
        
        // Encodage de l'objet
        $bodyTop = "Bonjour,\r\nC'est avec joie que nous avons bien reçu votre confirmation de présence.";
        $bodyBottom = "Merci pour votre participation ! Nous vous attendons avec impatience !\r\nPour plus de détails concernant l'événement, consultez le site (camilleetflorent.fr) ou laissez nous un message (mariage.camille.florent@gmail.fr).\r\nBises\r\n\nCamille et Florent";
        if($participation == 'false'){
            $bodyTop = "Bonjour,\r\nNous vous remercions chaleureusement pour votre réponse.";
            $bodyBottom = "Pour plus de détails concernant l'événement, consultez le site (camilleetflorent.fr) ou laissez nous un message (mariage.camille.florent@gmail.com).\r\nBises\r\n\nCamille et Florent";
        }

		// Construction du mail
		$object = '=?UTF-8?B?'.base64_encode('camilleetflorent.fr -- Réponse de '.$firstNames).'?=';
        $body = $bodyTop."\r\n\nParticipation: ".$participationLine."\r\nPrénom(s) et Nom(s): ".$firstNames."\r\nE-mail : ".$destinataire."\r\nCommentaire(s) : ".$comments."\r\n\n".$bodyBottom;
 
        // Envoi du mail
 
        if (mail($destinataire, $object, $body, $headers))
        {
            header( 'Location: http://www.camilleetflorent.fr/thankYou.html' );
        }
        else
        {
            echo '<p>'.$message_non_envoye.'</p>';
        };
    }
    else
    {
        // une des 3 variables (ou plus) est vide ...
        echo '<p>'.$message_formulaire_invalide.' <a href="./#rsvp">Retour au formulaire</a></p>'."\n";
    };
}; // fin du if (!isset($_POST['envoi']))

/*$emailTo = 'guiguitrm@gmail.com';			// change to your email

if($_SERVER['REQUEST_METHOD'] === 'POST') {
	$participation = stripslashes(trim($_POST['participation']));
	$firstNames = stripslashes(trim($_POST['firstNames']));
	$email = stripslashes(trim($_POST['email']));
	$countGuest = stripslashes(trim($_POST['countGuest']));
	$comments = stripslashes(trim($_POST['comments']));

	$body = '
		<strong>Participation : </strong>'.$participation.'<br />
		<strong>Prénom(s) et Nom(s): </strong>'.$firstNames.'<br />
		<strong>Email : </strong>'.$email.'<br />
		<strong>Nombre de concernés : </strong>'.$countGuest.'<br />
		<strong>Commentaires : </strong>'.$comments.'<br />
	';
	$headers  = "MIME-Version: 1.1" . PHP_EOL;
	$headers .= "Content-type: text/html; charset=utf-8" . PHP_EOL;
	$headers .= "Content-Transfer-Encoding: 8bit" . PHP_EOL;
	$headers .= "Date: " . date('r', $_SERVER['REQUEST_TIME']) . PHP_EOL;
	$headers .= "Message-ID: <" . $_SERVER['REQUEST_TIME'] . md5($_SERVER['REQUEST_TIME']) . '@' . $_SERVER['SERVER_NAME'] . '>' . PHP_EOL;
	$headers = "From: " .$email. PHP_EOL;
	$headers .= "Return-Path: $emailTo" . PHP_EOL;
	$headers .= "X-Mailer: PHP/". phpversion() . PHP_EOL;
	$headers .= "X-Originating-IP: " . $_SERVER['SERVER_ADDR'] . PHP_EOL;
	mail($emailTo, "[camilleetflorent.fr] Réponse de ".$firstNames, $body, $headers);
}*/
?>