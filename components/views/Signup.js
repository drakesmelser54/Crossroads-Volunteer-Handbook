
export default () => `
      <form id="signup-form" action="" method="POST" class="forms">
        <h2>Signup</h2>
        <input type="email" id="signup-email" name="signup-email" placeholder="Email" required />
        <input type="password" id="signup-password" name="signup-password" placeholder="Password" required />
        <label for="name">What's your name?</label>
        <input type="text" id="name" name="user" placeholder="Name">
        <a id="already" href="/Login" data-navigo>Already have an account?</a>
      </form>
`;
