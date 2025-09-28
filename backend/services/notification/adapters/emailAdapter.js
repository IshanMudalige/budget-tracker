
class EmailAdapter {
  send(to, message) {
    // integrate with real email service
    // this is just to showcase adapter patterns
    console.log(`Email sent to ${to}: ${message}`);
    return true;
  }
}

module.exports = EmailAdapter;
