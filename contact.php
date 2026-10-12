<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');

$LANG = strtolower(trim((string)($_POST['lang'] ?? 'en')));
if (!in_array($LANG, ['en', 'pl', 'de'], true)) $LANG = 'en';

function tr(string $key): string {
    global $LANG;
    $messages = [
        'method' => ['en'=>'This endpoint accepts contact form submissions only.','pl'=>'Ten punkt obsługuje wyłącznie formularze kontaktowe.','de'=>'Dieser Endpunkt akzeptiert nur Kontaktformular-Einsendungen.'],
        'name' => ['en'=>'Please provide a valid name.','pl'=>'Podaj prawidłowe imię i nazwisko.','de'=>'Bitte geben Sie einen gültigen Namen ein.'],
        'email' => ['en'=>'Please provide a valid email address.','pl'=>'Podaj prawidłowy adres e-mail.','de'=>'Bitte geben Sie eine gültige E-Mail-Adresse ein.'],
        'phone' => ['en'=>'Please check the phone number.','pl'=>'Sprawdź numer telefonu.','de'=>'Bitte überprüfen Sie die Telefonnummer.'],
        'company' => ['en'=>'Please check the company name.','pl'=>'Sprawdź nazwę firmy.','de'=>'Bitte überprüfen Sie den Firmennamen.'],
        'message' => ['en'=>'Please add a message (up to 6,000 characters).','pl'=>'Dodaj wiadomość (do 6 000 znaków).','de'=>'Bitte fügen Sie eine Nachricht hinzu (bis zu 6.000 Zeichen).'],
        'privacy' => ['en'=>'Please confirm that you have read the privacy notice.','pl'=>'Potwierdź zapoznanie się z polityką prywatności.','de'=>'Bitte bestätigen Sie, dass Sie die Datenschutzhinweise gelesen haben.'],
        'rate' => ['en'=>'Too many enquiries were sent from this connection. Please try again later or contact us directly by email.','pl'=>'Wysłano zbyt wiele zapytań z tego połączenia. Spróbuj później lub napisz bezpośrednio na nasz adres e-mail.','de'=>'Von dieser Verbindung wurden zu viele Anfragen gesendet. Bitte versuchen Sie es später erneut oder schreiben Sie uns direkt per E-Mail.'],
        'config' => ['en'=>'The contact form is not configured yet. Please email info@stachurski.com.pl directly.','pl'=>'Formularz nie jest jeszcze skonfigurowany. Napisz bezpośrednio na info@stachurski.com.pl.','de'=>'Das Kontaktformular ist noch nicht eingerichtet. Bitte schreiben Sie direkt an info@stachurski.com.pl.'],
        'delivery' => ['en'=>'We could not deliver your enquiry just now. Please try again or email info@stachurski.com.pl.','pl'=>'Nie udało się teraz dostarczyć zapytania. Spróbuj ponownie lub napisz na info@stachurski.com.pl.','de'=>'Ihre Anfrage konnte momentan nicht zugestellt werden. Bitte versuchen Sie es erneut oder schreiben Sie an info@stachurski.com.pl.'],
        'sent' => ['en'=>'Thank you — your enquiry is on its way. We’ll be in touch.','pl'=>'Dziękujemy — zapytanie zostało wysłane. Skontaktujemy się z Tobą.','de'=>'Vielen Dank — Ihre Anfrage wurde gesendet. Wir melden uns bei Ihnen.'],
        'subject' => ['en'=>'Website enquiry — Stachurski','pl'=>'Zapytanie ze strony internetowej — Stachurski','de'=>'Website-Anfrage — Stachurski'],
        'quoteSubject' => ['en'=>'Product quotation request — Stachurski','pl'=>'Zapytanie o wycenę produktu — Stachurski','de'=>'Anfrage für ein Produktangebot — Stachurski'],
        'intro' => ['en'=>'A new enquiry was sent through the Stachurski website.','pl'=>'Nowe zapytanie wysłane przez stronę Stachurski.','de'=>'Eine neue Anfrage wurde über die Stachurski-Website gesendet.']
    ];
    return $messages[$key][$LANG] ?? $messages[$key]['en'] ?? $key;
}
function respond(int $status, string $message): never {
    http_response_code($status);
    echo json_encode(['message' => $message], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}
function single_line(string $key, int $limit): string {
    $value = trim((string)($_POST[$key] ?? ''));
    if (strlen($value) > $limit || preg_match('/[\r\n]/', $value)) return "\0";
    return $value;
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, tr('method'));
}

$name = single_line('name', 300);
$email = single_line('email', 254);
$phone = single_line('phone', 120);
$company = single_line('company', 360);
$message = trim((string)($_POST['message'] ?? ''));
$privacy = (string)($_POST['privacy'] ?? '');
$honeypot = trim((string)($_POST['website'] ?? ''));

// Silent no-mail response for the hidden spam-trap field.
if ($honeypot !== '') respond(200, tr('sent'));
if ($name === '' || $name === "\0") respond(422, tr('name'));
if ($email === "\0" || !filter_var($email, FILTER_VALIDATE_EMAIL)) respond(422, tr('email'));
if ($phone === "\0") respond(422, tr('phone'));
if ($company === "\0") respond(422, tr('company'));
if ($message === '' || strlen($message) > 12000) respond(422, tr('message'));
if ($privacy !== '1') respond(422, tr('privacy'));

// Optional quotation specifications. Single-line fields reject CR/LF to prevent header/body injection.
$labels = [
    'product'=>'Product family / Grupa produktu / Produktgruppe',
    'model'=>'Model / Model / Modell',
    'rack_type'=>'Rack type / Typ stojaka / Gestelltyp',
    'length'=>'Length (mm) / Długość (mm) / Länge (mm)',
    'width'=>'Width (mm) / Szerokość (mm) / Breite (mm)',
    'loaded_height'=>'Load-carrying height (mm) / Wysokość załadowcza (mm) / Nutzhöhe (mm)',
    'total_height'=>'Overall height (mm) / Wysokość całkowita (mm) / Gesamthöhe (mm)',
    'support_profiles'=>'Support profiles / Profile oporowe / Stützprofile',
    'loading_profiles'=>'Loading profiles / Profile ładowności / Ladeprofile',
    'capacity'=>'Load capacity (kg) / Nośność (kg) / Tragfähigkeit (kg)',
    'corrosion'=>'Corrosion protection / finish / Zabezpieczenie / Oberfläche'
];
$specs = [];
foreach ($labels as $key => $label) {
    $value = single_line($key, 180);
    if ($value === "\0") respond(422, tr('message'));
    if ($value !== '') $specs[] = $label . ': ' . $value;
}
$rackType = (string)($_POST['rack_type'] ?? '');
if ($rackType !== '' && !in_array($rackType, ['A','L','T','D'], true)) respond(422, tr('message'));

// Limit repeated submissions per network address without storing personal form data.
$ip = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$key = hash('sha256', $ip . 'stachurski-contact-v1');
$rateFile = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'stachurski-contact-' . $key . '.json';
$now = time(); $window = 600; $limit = 5;
$rateHandle = @fopen($rateFile, 'c+');
if ($rateHandle !== false) {
    if (flock($rateHandle, LOCK_EX)) {
        $raw = stream_get_contents($rateHandle); $entries = json_decode($raw ?: '[]', true);
        if (!is_array($entries)) $entries = [];
        $entries = array_values(array_filter($entries, static fn($t) => is_int($t) && $t > $now - $window));
        if (count($entries) >= $limit) { flock($rateHandle, LOCK_UN); fclose($rateHandle); respond(429, tr('rate')); }
        $entries[] = $now; ftruncate($rateHandle, 0); rewind($rateHandle); fwrite($rateHandle, json_encode($entries)); fflush($rateHandle); flock($rateHandle, LOCK_UN);
    }
    fclose($rateHandle);
}

$to = getenv('STACHURSKI_CONTACT_EMAIL') ?: 'info@stachurski.com.pl';
$from = getenv('STACHURSKI_FROM_EMAIL') ?: 'website@stachurski.com.pl';
if (!filter_var($to, FILTER_VALIDATE_EMAIL) || !filter_var($from, FILTER_VALIDATE_EMAIL)) {
    error_log('Stachurski contact endpoint is missing valid mail configuration.');
    respond(500, tr('config'));
}
$subject = empty($specs) ? tr('subject') : tr('quoteSubject');
$body = tr('intro') . "\n\nName: {$name}\nEmail: {$email}\n";
$body .= 'Phone: ' . ($phone !== '' ? $phone : 'Not provided') . "\n";
$body .= 'Company: ' . ($company !== '' ? $company : 'Not provided') . "\n";
if ($specs) $body .= "\nProduct specifications:\n- " . implode("\n- ", $specs) . "\n";
$body .= "\nMessage:\n{$message}\n";
$headers = [
    'From' => 'Stachurski Website <' . $from . '>',
    'Reply-To' => $email,
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
    'X-Mailer' => 'PHP/' . PHP_VERSION,
];
$headerString = '';
foreach ($headers as $header => $value) $headerString .= $header . ': ' . $value . "\r\n";
if (!function_exists('mail') || !@mail($to, $subject, $body, $headerString)) {
    error_log('Stachurski contact mail failed; verify PHP mail transport on this host.');
    respond(503, tr('delivery'));
}
respond(200, tr('sent'));
