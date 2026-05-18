import {
  Screen,
  Typography,
  Button,
  Image
} from '@/shared/ui';
import { View } from 'react-native';

export default function Index() {
  return (
    <Screen className="flex-1 bg-background">
      <Typography variant="title">
        VizorLite
      </Typography>

      <Typography variant="caption">
        общайтесь, планируйте, решайте
      </Typography>

      <View className="gap-3">
        <Button className="gap-2 items-center">

          <Image
            source={require("../shared/assets/images/webcamera.png")}
            style={{ width: 50, height: 50 }}
          />
          Создать 
          видеовстречу
        </Button>

        <Button variant="secondary">
          <Image 
            source={require('../shared/assets/images/join.png')} 
            style={{ width: 50, height: 50 }} 
          />

          Подключиться
        </Button>

      </View>
    </Screen>
  );
}
