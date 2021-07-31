export default () => `
<section class="home-jumbotron">
<div class="contact-container">
  <form class="contact-form" action="https://formspree.io/f/mvodware" method="POST">
    <label for="fname">Name</label>
    <input type="text" id="fname" name="name" placeholder="Your name..">
    <label for="reason">What can we help with?</label>
    <select id="reason" name="reason">
      <option value="Feedback">Feedback</option>
      <option value="Account">Account</option>
      <option value="Suggestion">Suggestions</option>
      <option value="Question">Question</option>
      <option value="Other">Other</option>
    </select>
  <label for="message">Message</label>
  <textarea name="message" placeholder="Tell us how we can help!" max-length="200"></textarea>
  <input type="submit" target="_blank" value="Submit">
  </form>
</div>
</section>
`;
