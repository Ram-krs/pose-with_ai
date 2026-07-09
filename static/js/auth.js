document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.auth-card');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        const password = form.querySelector('input[name="password"]');
        const confirmPassword = form.querySelector('input[name="confirm_password"]');

        if (password && confirmPassword && password.value !== confirmPassword.value) {
            event.preventDefault();
            alert('Passwords do not match.');
        }
    });
});
