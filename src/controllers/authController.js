const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Hàm tạo JWT token
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // Token hết hạn sau 7 ngày
    );
};

// Đăng ký
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Kiểm tra đủ dữ liệu
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        // Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Tạo user mới
        const user = new User({ name, email, password });
        await user.save();

        // Tạo token
        const token = generateToken(user._id);

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: user._id, name: user.name, email: user.email },
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Đăng nhập
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra đủ dữ liệu
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Tìm user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Tạo token
        const token = generateToken(user._id);

        res.status(200).json({
            message: 'Login successful',
            user: { id: user._id, name: user.name, email: user.email },
            token
        });
    } catch (err) {
        console.error('Auth error:', err); // Log chi tiết lỗi
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
