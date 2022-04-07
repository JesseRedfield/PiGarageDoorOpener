#install aptitude dependencies
apt-get install npm build-essential

#npm install typescript
npm install -g typescript

# Setup NO-IRQ for rpio, prevents crashes
echo "\n[all]\n\n# Enable GPIO without no IRQ for rpio NPM\ndtoverlay=gpio-no-irq\n" >> /boot/config.txt

# setup GPIO MEM rules
cat >/etc/udev/rules.d/20-gpiomem.rules << EOF
SUBSYSTEM=="bcm2835-gpiomem", KERNEL=="gpiomem", GROUP="gpio", MODE="0660"
EOF

# setup write access to MEM
cat >/etc/udev/rules.d/98-mem.rules << EOF
SUBSYSTEM=="mem", KERNEL=="mem", GROUP="kmem", MODE="0660"
EOF

# add the current user to the gpio group
usermod -a -G gpio $USER
usermod -a -G kmem $USER